import React, { FC, useState, useCallback, forwardRef } from 'react';
import ReactRTE, { EditorValue, ToolbarConfig } from 'react-rte';

export const RichTextEditor: FC<any> = forwardRef(({ onChange, ...props }, ref) => {
  const toolbarConfig: ToolbarConfig = {
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
      { label: 'Bold', style: 'BOLD' },
      { label: 'Italic', style: 'ITALIC' },
      // { label: 'Underline', style: 'UNDERLINE' }
    ],
    BLOCK_TYPE_DROPDOWN: [],
    BLOCK_TYPE_BUTTONS: [
      { label: 'UL', style: 'unordered-list-item' },
      { label: 'OL', style: 'ordered-list-item' }
    ]
  };
  
  const [editorValue, setEditorValue] = useState<EditorValue>(
    ReactRTE.createValueFromString(props.defaultValue || '', 'html')
  );

  const handleChange = useCallback((value: EditorValue) => {
    setEditorValue(value);
    onChange(value.toString('html'));
  }, [setEditorValue, onChange]);
  
  return (
    <ReactRTE
      toolbarConfig={toolbarConfig}
      className='rich-text-editor'
      {...props}
      ref={ref}
      value={editorValue}
      onChange={handleChange}
    />
  );
});