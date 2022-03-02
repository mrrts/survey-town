import React, { FC } from 'react';
import { ModalKeys } from '../../../constants/ModalKeys.enum';
import { useModal } from '../../../util/hooks/useModal.hook';
import Modal from 'react-bootstrap/Modal';
import { useSurvey } from '../../../util/hooks/useSurvey.hook';
import Button from 'react-bootstrap/Button';
import { TakeSurvey } from './TakeSurvey';

export interface ITakeSurveyModalProps {}

export const TakeSurveyModal: FC<ITakeSurveyModalProps> = () => {
  const modal = useModal(ModalKeys.TAKE_SURVEY);

  const { survey } = useSurvey(modal.data?.surveyId);

  const handleCloseClick = () => {
    modal.clearData();
    modal.closeModal();
  };

  return (
    <Modal show={modal.isOpen}>
      <Modal.Header>
        <h4><strong>{survey?.title}</strong></h4>
      </Modal.Header>
      <Modal.Body>
        <TakeSurvey surveyId={modal.data?.surveyId} />
      </Modal.Body>
      <Modal.Footer>
        <Button className='close-modal-button' variant='secondary' onClick={handleCloseClick}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};