import React, { useState } from 'react';
import { Modal, Upload, message, Input, InputNumber } from 'antd';
import { uploadImage } from '@/lib/supabase';

interface GalleryImage {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
}

interface GalleryBlockModalProps {
  open: boolean;
  onOk: (block: {
    images: GalleryImage[];
    layout: 'grid' | 'carousel';
    columns: number;
    gap: string;
  }) => void;
  onCancel: () => void;
}

const GalleryBlockModal: React.FC<GalleryBlockModalProps> = ({ open, onOk, onCancel }) => {
  const [galleryLayout, setGalleryLayout] = useState<'grid' | 'carousel'>('grid');
  const [galleryColumns, setGalleryColumns] = useState(3);
  const [galleryGap, setGalleryGap] = useState('0.75rem');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryUploading, setGalleryUploading] = useState(false);

  return (
    <Modal
      title="Add Gallery Block"
      open={open}
      onOk={() => {
        onOk({
          images: galleryImages,
          layout: galleryLayout,
          columns: galleryColumns,
          gap: galleryGap,
        });
        setGalleryImages([]);
      }}
      onCancel={onCancel}
      width={600}
      okText="Add"
      cancelText="Cancel"
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="block font-medium mb-1">Columns</label>
          <InputNumber
            min={1}
            max={8}
            className="w-full"
            value={galleryColumns}
            onChange={(v) => setGalleryColumns(Number(v))}
            disabled={galleryLayout === 'carousel'}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Gap</label>
          <Input
            className="w-full"
            value={galleryGap}
            onChange={(e) => setGalleryGap(e.target.value)}
            placeholder="e.g. 0.75rem, 8px, 1em"
            disabled={galleryLayout === 'carousel'}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Gap</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={galleryGap}
            onChange={(e) => setGalleryGap(e.target.value)}
            placeholder="e.g. 0.75rem, 8px, 1em"
            disabled={galleryLayout === 'carousel'}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Images</label>
          <Upload.Dragger
            name="images"
            multiple
            accept="image/*"
            showUploadList={false}
            customRequest={async (options) => {
              //   const { file, onSuccess, onError } = options;
              //   setGalleryUploading(true);
              //   try {
              //     setGalleryUploading(true);
              //     const url = await uploadImage(file as File, 'images'); // <-- Use Supabase upload
              //     const newImage: GalleryImage = {
              //       id: crypto.randomUUID(),
              //       url,
              //       alt: file.name,
              //       caption: '',
              //     };
              //     setGalleryImages((prev) => [...prev, newImage]);
              //     message.success(`${file.name} uploaded successfully`);
              //     return false;
              //   } catch (error) {
              //     message.error(`${file.name} upload failed`);
              //     console.error(error);
              //     return false;
              //   } finally {
              //     setGalleryUploading(false);
              //   }
            }}
            disabled={galleryUploading}
          >
            <p className="ant-upload-drag-icon">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <path
                  fill="#1677ff"
                  d="M12 16a1 1 0 0 1-1-1V9.83l-1.88 1.88a1 1 0 1 1-1.42-1.42l3.59-3.59a1 1 0 0 1 1.42 0l3.59 3.59a1 1 0 1 1-1.42 1.42L13 9.83V15a1 1 0 0 1-1 1Z"
                />
                <path fill="#1677ff" d="M19 18H5a1 1 0 1 1 0-2h14a1 1 0 1 1 0 2Z" />
              </svg>
            </p>
            <p>Click or drag image files to this area to upload</p>
          </Upload.Dragger>
          {galleryUploading && <div className="text-blue-500 mt-2">Uploading...</div>}
          <div className="flex flex-wrap gap-2 mt-2">
            {galleryImages.map((img) => (
              <div
                key={img.id}
                className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center"
              >
                <img src={img.url} alt={img.alt} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GalleryBlockModal;
