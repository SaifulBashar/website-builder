import React, { useMemo } from 'react';
import { Modal, Input, Button, Card } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { GalleryBlock } from '@/types/blocks';
import { Formik, Form as FormikForm, FieldArray, FormikErrors } from 'formik';

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
  type ImageItem = { id: string; url: string; alt?: string; caption?: string };
  type GalleryFormValues = { images: ImageItem[] };

  const defaultImage = (): ImageItem => ({
    id: crypto.randomUUID(),
    url: '',
    alt: '',
    caption: '',
  });

  const initialValues: GalleryFormValues = useMemo(() => {
    if (editingBlock && open) {
      const blockImages = editingBlock.images || [];
      const normalizedImages = blockImages.map((img) => ({
        id: (img as any).id || crypto.randomUUID(),
        url: (img as any).url || '',
        alt: (img as any).alt || '',
        caption: (img as any).caption || '',
      }));
      return { images: normalizedImages.length > 0 ? normalizedImages : [defaultImage()] };
    }
    if (open && !editingBlock) {
      return { images: [defaultImage()] };
    }
    return { images: [defaultImage()] };
  }, [editingBlock, open]);

  const validate = (values: GalleryFormValues) => {
    const errors: FormikErrors<GalleryFormValues> & { images?: Array<Record<string, string>> } = {};
    if (!values.images || values.images.length === 0) {
      errors.images = [{ url: 'Please enter image URL' }];
    } else {
      const imageErrors = values.images.map((img) => {
        const e: Record<string, string> = {};
        if (!img.url || img.url.trim() === '') {
          e.url = 'Please enter image URL';
        }
        return e;
      });
      if (imageErrors.some((e) => Object.keys(e).length > 0)) {
        errors.images = imageErrors;
      }
    }
    return errors;
  };

  const onSubmit = (values: GalleryFormValues) => {
    const validImages = values.images.filter((img) => img.url && img.url.trim() !== '');
    if (validImages.length === 0) return;
    onOk({ images: validImages });
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, setFieldValue, handleBlur, resetForm, submitForm }) => (
        <Modal
          title={title}
          open={open}
          onOk={submitForm}
          onCancel={() => {
            resetForm();
            onCancel();
          }}
          width={900}
          okText={editingBlock ? 'Update' : 'Add'}
        >
          <FormikForm>
            <FieldArray name="images">
              {({ push, remove }) => (
                <div className="space-y-4">
                  {values.images.map((image, index) => (
                    <Card
                      key={image.id}
                      size="small"
                      title={`Image ${index + 1}`}
                      extra={
                        values.images.length > 1 && (
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(index)}
                          />
                        )
                      }
                    >
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Image URL</label>
                          <Input
                            name={`images[${index}].url`}
                            placeholder="Enter image URL"
                            value={image.url}
                            onChange={(e) => setFieldValue(`images[${index}].url`, e.target.value)}
                            onBlur={handleBlur}
                          />
                          {touched.images &&
                            (touched.images as any)[index]?.url &&
                            (errors.images as any)?.[index]?.url && (
                              <div className="text-red-500 text-sm mt-1">
                                {(errors.images as any)[index].url}
                              </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Alt Text</label>
                            <Input
                              name={`images[${index}].alt`}
                              placeholder="Alt text for accessibility"
                              value={image.alt}
                              onChange={(e) =>
                                setFieldValue(`images[${index}].alt`, e.target.value)
                              }
                              onBlur={handleBlur}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Caption</label>
                            <Input
                              name={`images[${index}].caption`}
                              placeholder="Image caption"
                              value={image.caption}
                              onChange={(e) =>
                                setFieldValue(`images[${index}].caption`, e.target.value)
                              }
                              onBlur={handleBlur}
                            />
                          </div>
                        </div>

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
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => push(defaultImage())}
                      className="w-full"
                    >
                      Add Another Image
                    </Button>
                  </div>
                </div>
              )}
            </FieldArray>
          </FormikForm>
        </Modal>
      )}
    </Formik>
  );
};

export default GalleryEditModal;
