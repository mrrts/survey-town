import React, { FC, useCallback, useEffect } from "react";
import { Control, useFieldArray, UseFormRegister } from "react-hook-form";
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSurveyItem } from "../../../util/hooks/useSurveyItem.hook";

interface IItemWithChoicesFieldsProps {
  register: UseFormRegister<any>;
  errors: { [x: string]: any };
  control: Control<any>;
  surveyItemId: string;
  reset: any;
}

export const ItemWithChoicesFields: FC<IItemWithChoicesFieldsProps> = ({
  register,
  errors,
  control,
  surveyItemId,
  reset 
}) => {
  const { surveyItem } = useSurveyItem(surveyItemId);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'choices'
  });

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    append('');
  };

  const handleDeleteClick = useCallback((index: number) => {
    remove(index);
  }, [remove]);

  // need to do this for fields to initialize and populate with current values
  useEffect(() => {
    reset({ choices: surveyItem.choices })
  }, [reset, surveyItem?.choices])

  return (
    <>
      <Form.Group>
        <Form.Label>Question Prompt</Form.Label>
        <Form.Control
          as='textarea'
          rows={2}
          { ...register('prompt') }
          defaultValue={surveyItem?.prompt}
        />
        <p className='text-danger'>{errors?.prompt?.message}</p>
      </Form.Group>
      <Form.Group className='add-choices-group'>
        <Form.Label>Choices</Form.Label>
        {fields.map((field, i) => {
          return (
            <div key={field.id} className='choice-container'>
              <Button
                variant='danger'
                className='delete-choice-button'
                size='sm'
                aria-label='delete this choice'
                onClick={() => handleDeleteClick(i)}
              >
                <FontAwesomeIcon className='delete-choice-icon' icon={faTimes} />
              </Button>
              <Form.Control
                { ...register(`choices[${i}]`) }
                placeholder={`Choice ${i + 1}`}
                defaultValue={surveyItem?.choices?.[i]}
              />
              <p className='text-danger'>{errors?.choices?.[i]?.message}</p>
            </div>
          );
        })}
        <div className='add-choice-container'>
          <Button variant='primary' size='sm' onClick={handleAddClick}>
            <FontAwesomeIcon icon={faPlus} />
            Add Choice
          </Button>
        </div>
      </Form.Group>
    </>
  );
}