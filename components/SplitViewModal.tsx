import React from 'react';
import { Modal, Input, Select, Radio, Form } from 'antd';
import { SplitViewBlock } from '@/types/blocks';
import Editor from './Editor';

interface SplitViewModalProps {
  open: boolean;
  onOk: (values: {
    leftContent: { type: 'text' | 'image'; content: string };
    rightContent: { type: 'text' | 'image'; content: string };
    ratio: '30-70' | '40-60' | '50-50' | '60-40' | '70-30';
    verticalAlign: 'top' | 'center' | 'bottom';
  }) => void;
  onCancel: () => void;
  editingBlock?: SplitViewBlock | null;
  title?: string;
}

const SplitViewModal: React.FC<SplitViewModalProps> = ({
  open,
  onOk,
  onCancel,
  editingBlock,
  title = 'Add Split-View Block',
}) => {
  const [form] = Form.useForm();
  const [leftEditorContent, setLeftEditorContent] = React.useState('');
  const [rightEditorContent, setRightEditorContent] = React.useState('');

  // Set initial values when editing
  React.useEffect(() => {
    if (editingBlock && open) {
      const leftContent = editingBlock.leftContent.content;
      const rightContent = editingBlock.rightContent.content;

      form.setFieldsValue({
        leftType: editingBlock.leftContent.type,
        leftContent: leftContent,
        rightType: editingBlock.rightContent.type,
        rightContent: rightContent,
        ratio: editingBlock.ratio || '50-50',
        verticalAlign: editingBlock.verticalAlign || 'top',
      });

      // Set editor content states
      if (editingBlock.leftContent.type === 'text') {
        setLeftEditorContent(leftContent);
      }
      if (editingBlock.rightContent.type === 'text') {
        setRightEditorContent(rightContent);
      }
    } else if (open && !editingBlock) {
      // Set defaults for new blocks
      form.setFieldsValue({
        leftType: 'image',
        leftContent: '',
        rightType: 'text',
        rightContent: '',
        ratio: '50-50',
        verticalAlign: 'center',
      });

      // Reset editor content
      setLeftEditorContent('');
      setRightEditorContent('');
    }
  }, [editingBlock, open]);

  const handleOk = () => {
    const formValues = form.getFieldsValue();
    onOk({
      leftContent: {
        type: formValues.leftType,
        content: formValues.leftType === 'text' ? leftEditorContent : formValues.leftContent,
      },
      rightContent: {
        type: formValues.rightType,
        content: formValues.rightType === 'text' ? rightEditorContent : formValues.rightContent,
      },
      ratio: formValues.ratio,
      verticalAlign: formValues.verticalAlign,
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setLeftEditorContent('');
    setRightEditorContent('');
    onCancel();
  };

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1200}
      okText={editingBlock ? 'Update' : 'Add'}
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Left Content</h3>
            <Form.Item name="leftType" label="Content Type">
              <Select>
                <Select.Option value="text">Text</Select.Option>
                <Select.Option value="image">Image</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.leftType !== currentValues.leftType
              }
            >
              {({ getFieldValue }) => {
                const leftType = getFieldValue('leftType');
                return (
                  <Form.Item
                    name="leftContent"
                    label={
                      leftType === 'image' ? (
                        <div>
                          Image URL
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: 'normal',
                              color: '#666',
                              marginTop: '4px',
                            }}
                          >
                            Try:{' '}
                            <a
                              onClick={() =>
                                form.setFieldsValue({
                                  leftContent:
                                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                                })
                              }
                              style={{
                                cursor: 'pointer',
                                color: '#1890ff',
                                textDecoration: 'underline',
                              }}
                            >
                              Mountain
                            </a>
                            {' | '}
                            <a
                              onClick={() =>
                                form.setFieldsValue({
                                  leftContent:
                                    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                                })
                              }
                              style={{
                                cursor: 'pointer',
                                color: '#1890ff',
                                textDecoration: 'underline',
                              }}
                            >
                              Forest
                            </a>
                          </div>
                        </div>
                      ) : (
                        'Text Content'
                      )
                    }
                    rules={[{ required: true, message: 'Please enter content' }]}
                  >
                    {leftType === 'image' ? (
                      <Input placeholder="Enter image URL" />
                    ) : (
                      <Editor
                        key={`left-editor-${open}`}
                        defaultValue={
                          editingBlock?.leftContent.type === 'text'
                            ? editingBlock.leftContent.content
                            : ''
                        }
                        onChange={(content) => {
                          setLeftEditorContent(content);
                          form.setFieldValue('leftContent', content);
                        }}
                        placeholder="Enter your text content..."
                      />
                    )}
                  </Form.Item>
                );
              }}
            </Form.Item>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Right Content</h3>
            <Form.Item name="rightType" label="Content Type">
              <Select>
                <Select.Option value="text">Text</Select.Option>
                <Select.Option value="image">Image</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.rightType !== currentValues.rightType
              }
            >
              {({ getFieldValue }) => {
                const rightType = getFieldValue('rightType');
                return (
                  <Form.Item
                    name="rightContent"
                    label={
                      rightType === 'image' ? (
                        <div>
                          Image URL
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: 'normal',
                              color: '#666',
                              marginTop: '4px',
                            }}
                          >
                            Try:{' '}
                            <a
                              onClick={() =>
                                form.setFieldsValue({
                                  rightContent:
                                    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                                })
                              }
                              style={{
                                cursor: 'pointer',
                                color: '#1890ff',
                                textDecoration: 'underline',
                              }}
                            >
                              Ocean
                            </a>
                            {' | '}
                            <a
                              onClick={() =>
                                form.setFieldsValue({
                                  rightContent:
                                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                                })
                              }
                              style={{
                                cursor: 'pointer',
                                color: '#1890ff',
                                textDecoration: 'underline',
                              }}
                            >
                              City
                            </a>
                          </div>
                        </div>
                      ) : (
                        'Text Content'
                      )
                    }
                    rules={[{ required: true, message: 'Please enter content' }]}
                  >
                    {rightType === 'image' ? (
                      <Input placeholder="Enter image URL" />
                    ) : (
                      <Editor
                        key={`right-editor-${open}`}
                        defaultValue={
                          editingBlock?.rightContent.type === 'text'
                            ? editingBlock.rightContent.content
                            : ''
                        }
                        onChange={(content) => {
                          setRightEditorContent(content);
                          form.setFieldValue('rightContent', content);
                        }}
                        placeholder="Enter your text content..."
                      />
                    )}
                  </Form.Item>
                );
              }}
            </Form.Item>
          </div>
        </div>

        <div className="mt-6">
          <Form.Item name="ratio" label="Column Ratio">
            <Radio.Group>
              <Radio value="30-70">30-70</Radio>
              <Radio value="40-60">40-60</Radio>
              <Radio value="50-50">50-50</Radio>
              <Radio value="60-40">60-40</Radio>
              <Radio value="70-30">70-30</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="verticalAlign" label="Vertical Alignment">
            <Radio.Group>
              <Radio value="top">Top</Radio>
              <Radio value="center">Center</Radio>
              <Radio value="bottom">Bottom</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default SplitViewModal;
