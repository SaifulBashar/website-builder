import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Form, Space, Card } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { GalleryBlock } from '@/types/blocks';

interface GalleryEditModalProps {
  open: boolean;
  onOk: (values: {
    images: {
      id: string;
      url: string;
      alt?: string;
      caption?: string;
    }[];
  }) => void;
  onCancel: () => void;
  editingBlock?: GalleryBlock | null;
  title?: string;
}

const GalleryEditModal: React.FC<GalleryEditModalProps> = ({
  open,
  onOk,
  onCancel,
  editingBlock,
  title = 'Edit Gallery Block',
}) => {
  const [form] = Form.useForm();
  const [images, setImages] = useState<
    {
      id: string;
      url: string;
      alt?: string;
      caption?: string;
    }[]
  >([{ id: crypto.randomUUID(), url: '', alt: '', caption: '' }]);

  // Set initial values when editing
  useEffect(() => {
    if (editingBlock && open) {
      const blockImages = editingBlock.images || [];
      const normalizedImages = blockImages.map((img) => ({
        ...img,
        alt: img.alt || '',
        caption: img.caption || '',
      }));
      setImages(
        normalizedImages.length > 0
          ? normalizedImages
          : [{ id: crypto.randomUUID(), url: '', alt: '', caption: '' }]
      );
      form.setFieldsValue({ images: normalizedImages });
    } else if (open && !editingBlock) {
      // Reset for new blocks
      const defaultImages = [{ id: crypto.randomUUID(), url: '', alt: '', caption: '' }];
      setImages(defaultImages);
      form.setFieldsValue({ images: defaultImages });
    }
  }, [editingBlock, open, form]);

  const handleOk = async () => {
    try {
      // Validate form fields
      await form.validateFields();

      // Filter out empty images from our state
      const validImages = images.filter((img) => img.url && img.url.trim() !== '');

      if (validImages.length === 0) {
        return; // Don't submit if no valid images
      }

      onOk({ images: validImages });
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setImages([{ id: crypto.randomUUID(), url: '', alt: '', caption: '' }]);
    onCancel();
  };

  const addImage = () => {
    const newImages = [...images, { id: crypto.randomUUID(), url: '', alt: '', caption: '' }];
    setImages(newImages);
    form.setFieldsValue({ images: newImages });
  };

  const removeImage = (index: number) => {
    if (images.length > 1) {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      form.setFieldsValue({ images: newImages });
    }
  };

  const updateImage = (index: number, field: string, value: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    setImages(newImages);
    // Update the specific form field
    form.setFieldValue(['images', index, field], value);
  };

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={900}
      okText={editingBlock ? 'Update' : 'Add'}
    >
      <Form form={form} layout="vertical">
        <div className="space-y-4">
          {images.map((image, index) => (
            <Card
              key={image.id}
              size="small"
              title={`Image ${index + 1}`}
              extra={
                images.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeImage(index)}
                  />
                )
              }
            >
              <div className="grid grid-cols-1 gap-3">
                <Form.Item
                  name={['images', index, 'url']}
                  label="Image URL"
                  rules={[{ required: true, message: 'Please enter image URL' }]}
                >
                  <Input
                    placeholder="Enter image URL"
                    value={image.url}
                    onChange={(e) => updateImage(index, 'url', e.target.value)}
                  />
                </Form.Item>

                <div className="grid grid-cols-2 gap-3">
                  <Form.Item name={['images', index, 'alt']} label="Alt Text">
                    <Input
                      placeholder="Alt text for accessibility"
                      value={image.alt}
                      onChange={(e) => updateImage(index, 'alt', e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item name={['images', index, 'caption']} label="Caption">
                    <Input
                      placeholder="Image caption"
                      value={image.caption}
                      onChange={(e) => updateImage(index, 'caption', e.target.value)}
                    />
                  </Form.Item>
                </div>

                {/* Preview image if URL is provided */}
                {image.url && (
                  <div className="mt-2">
                    <img
                      src={image.url}
                      alt={image.alt || 'Preview'}
                      className="w-full h-32 object-cover rounded border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'block';
                      }}
                    />
                  </div>
                )}
              </div>
            </Card>
          ))}

          <div className="flex justify-center">
            <Button type="dashed" icon={<PlusOutlined />} onClick={addImage} className="w-full">
              Add Another Image
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default GalleryEditModal;
