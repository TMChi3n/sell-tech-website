import React, { useState } from "react";
import { Modal, Button } from "antd";

const DeleteProduct = ({ isModalDeleteOpen, handleConfirmDelete, onCancel }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAccept = async () => {
    setIsDeleting(true);
    await handleConfirmDelete();
    setIsDeleting(false);
  };

  return (
    <Modal
      title="Delete product"
      visible={isModalDeleteOpen}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="delete" type="primary" danger onClick={handleAccept} loading={isDeleting}>
          Delete
        </Button>,
      ]}
      okText="Accept"
      cancelText="Cancel"
      confirmLoading={isDeleting}
    >
      <p>Are you sure you want to delete this product?</p>
    </Modal>
  );
};

export default DeleteProduct;
