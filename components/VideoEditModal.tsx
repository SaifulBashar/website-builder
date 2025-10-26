import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch } from 'antd';
import { VideoBlock } from '@/types/blocks';

interface VideoEditModalProps {
  open: boolean;
  title: string;
  editingBlock: VideoBlock | null;
  onOk: (values: {
    url: string;
    autoplay: boolean;
    loop: boolean;
    muted: boolean;
    width: string;
    height: string;
  }) => void;
  onCancel: () => void;
}

const VideoEditModal: React.FC<VideoEditModalProps> = ({
  open,
  title,
  editingBlock,
  onOk,
  onCancel,
}) => {
  const [form] = Form.useForm();

  // Update form values when editingBlock changes
  useEffect(() => {
    if (editingBlock && open) {
      form.setFieldsValue({
        url: editingBlock.url || '',
        autoplay: editingBlock.autoplay || false,
        loop: editingBlock.loop || false,
        muted: editingBlock.muted || false,
        width: editingBlock.styles?.width || '100%',
        height: editingBlock.styles?.height || '480px',
      });
    }
  }, [editingBlock, open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal title={title} open={open} onOk={handleOk} onCancel={handleCancel} width={600}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          url: editingBlock?.url || '',
          autoplay: editingBlock?.autoplay || false,
          loop: editingBlock?.loop || false,
          muted: editingBlock?.muted || false,
          width: editingBlock?.styles?.width || '100%',
          height: editingBlock?.styles?.height || '480px',
        }}
      >
        <Form.Item
          label="Video URL"
          name="url"
          rules={[
            { required: true, message: 'Please enter a video URL' },
            { type: 'url', message: 'Please enter a valid URL' },
          ]}
        >
          <Input placeholder="Enter video URL (e.g., https://example.com/video.mp4)" />
        </Form.Item>

        <Form.Item label="Width" name="width">
          <Input placeholder="e.g., 100%, 800px" />
        </Form.Item>

        <Form.Item label="Height" name="height">
          <Input placeholder="e.g., 480px, 50vh" />
        </Form.Item>

        <Form.Item name="autoplay" valuePropName="checked">
          <Switch /> Autoplay
        </Form.Item>

        <Form.Item name="loop" valuePropName="checked">
          <Switch /> Loop
        </Form.Item>

        <Form.Item name="muted" valuePropName="checked">
          <Switch /> Muted
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VideoEditModal;
