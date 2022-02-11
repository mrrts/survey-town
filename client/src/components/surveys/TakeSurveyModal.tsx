import React, { FC } from 'react';
import { ModalKeys } from '../../constants/ModalKeys.enum';
import { useModal } from '../../util/hooks/useModal.hook';
import Modal from 'react-bootstrap/Modal';
import { useSurvey } from '../../util/hooks/useSurvey.hook';
import Button from 'react-bootstrap/Button';

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
        {survey?.title}
      </Modal.Header>
      <Modal.Body>
        Take-Survey UI 
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleCloseClick}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};