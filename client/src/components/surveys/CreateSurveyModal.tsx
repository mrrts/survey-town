import React, { FC, useCallback } from 'react';
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
import { SurveyDto } from '../../entities/dtos/survey.dto';
import { CreateSurveyDto } from '../../entities/dtos/create-survey.dto';
import { createSurvey } from '../../store/surveys/slice';

export interface ICreateSurveyModalProps {

}

export const CreateSurveyModal: FC<ICreateSurveyModalProps> = () => {
  const modal = useModal(ModalKeys.CREATE_SURVEY);
  const dispatch = useAppDispatch();
  const schema = yup.object().shape({
    title: yup.string().required().min(4).max(100),
    description: yup.string().required().min(4).max(500)
  }).required();

  const { register, handleSubmit, formState: { errors }, getValues, reset } = useForm({
    resolver: yupResolver(schema)
  });

  const valid = keys(errors).length === 0;

  const onSubmit = useCallback((data: any) => {
    
    if (valid) {
      const values = getValues();
      console.log(values);
      const dto: CreateSurveyDto = new CreateSurveyDto({
        title: values.title,
        description: values.description
      });
      reset();
      dispatch(createSurvey({ dto }));
      modal.closeModal();
    }
  }, [getValues, valid, reset, dispatch, modal]);

  return (
    <Modal show={modal.isOpen}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header>
          <Modal.Title>New Survey</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              { ...register('title') }
              type='text'
              maxLength={100}
            ></Form.Control>
            <Form.Text className='text-danger'>{errors.title?.message}</Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Descriptiion</Form.Label>
            <Form.Control
              { ...register('description') }
              as='textarea'
              maxLength={500}
              rows={2}
            ></Form.Control>
            <Form.Text className='text-danger'>{errors.description?.message}</Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => modal.closeModal()}>
            Close
          </Button>
          <Button type='submit' variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};