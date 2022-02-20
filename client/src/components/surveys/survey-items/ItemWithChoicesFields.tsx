import React, { FC, useCallback, useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSurveyItem } from "../../../util/hooks/useSurveyItem.hook";
import FlipMove from 'react-flip-move';

interface IItemWithChoicesFieldsProps {
  surveyItemId: string;
}

export const ItemWithChoicesFields: FC<IItemWithChoicesFieldsProps> = ({
  surveyItemId,
}) => {
  const { surveyItem } = useSurveyItem(surveyItemId);

  const { register, control, reset, formState: { errors }} = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'choices'
  });

  const handleAddClick = () => {
    append(`Choice ${fields.length + 1}`);
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
        <Form.Label>Question / Prompt</Form.Label>
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
        <FlipMove typeName={null}>
          {fields.map((field, i) => {
            return (
              <div key={field.id} className='choice-container'>
                <Button
                  variant='link'
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
        </FlipMove>
        <div className='add-choice-container'>
          <Button className='my-2' variant='primary' size='sm' onClick={handleAddClick}>
            <FontAwesomeIcon icon={faPlus} />
            Add Choice
          </Button>
        </div>
      </Form.Group>
    </>
  );
}