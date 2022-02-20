import React, { FC, useCallback, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ModalKeys } from '../../constants/ModalKeys.enum';
import { useModal } from '../../util/hooks/useModal.hook';
import Form from 'react-bootstrap/Form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { keys } from 'lodash';
import { useAppDispatch } from '../../store';
import { CreateSurveyDto } from '../../entities/dtos/create-survey.dto';
import { createSurvey, updateSurvey } from '../../store/surveys/slice';
import { useSurvey } from '../../util/hooks/useSurvey.hook';
import { UpdateSurveyDto } from '../../entities/dtos/update-survey.dto';

export interface ISurveyGeneralFormModalProps {

}

export const SurveyGeneralFormModal: FC<ISurveyGeneralFormModalProps> = () => {
  const modal = useModal(ModalKeys.SURVEY_GENERAL);
  const surveyId = modal.data?.surveyId;
  const { survey } = useSurvey(surveyId);
  const dispatch = useAppDispatch();

  const schema = yup.object().shape({
    title: yup.string().required().min(4).max(100),
    description: yup.string().max(500)
  }).required();

  const { register, handleSubmit, formState: { errors }, getValues, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const valid = keys(errors).length === 0;

  const onSubmit = useCallback((data: any) => {
    if (valid) {
      const values = getValues();

      if (!survey) {
        const dto: CreateSurveyDto = new CreateSurveyDto({
          title: values.title,
          description: values.description
        });
        dispatch(createSurvey({ dto }));
      } else {
        const dto: UpdateSurveyDto = new UpdateSurveyDto({
          title: values.title,
          description: values.description
        });
        dispatch(updateSurvey({ surveyId: survey?.uuid, dto }));
      }

      modal.closeModal();
    }
  }, [getValues, valid, dispatch, modal, survey]);
  
  const handleCloseClick = () => {
    modal.closeModal();
  };

  useEffect(() => {
    if (modal.isOpen) {
      reset();
    }
  }, [modal.isOpen, reset]);

  return (
    <Modal show={modal.isOpen}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header>
          <Modal.Title>{survey ? 'Edit' : 'New'} Survey</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Title*</Form.Label>
            <Form.Control
              { ...register('title') }
              type='text'
              maxLength={100}
              defaultValue={survey?.title}
            ></Form.Control>
            <Form.Text className='text-danger'>{errors.title?.message}</Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              { ...register('description') }
              as='textarea'
              maxLength={500}
              rows={2}
              defaultValue={survey?.description}
            ></Form.Control>
            <Form.Text className='text-danger'>{errors.description?.message}</Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseClick}>
            Close
          </Button>
          <Button type='submit' variant="primary" disabled={!valid}>
            {survey ? 'Update' : 'Create'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
