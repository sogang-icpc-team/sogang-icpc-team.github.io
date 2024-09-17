import { Modal as AntdModal } from "antd";
import { useEffect, useState } from "react";
import { createGlobalStyle } from "styled-components";

const ModalStyles = createGlobalStyle`
  .ant-modal-mask {
    background-color: transparent !important;
    backdrop-filter: blur(1px);
  }
`;
export const Modal = ({
  show,
  onClose,
  header,
  body,
  footer,
}: {
  show: boolean;
  onClose: () => void;
  header?: React.ReactNode;
  body: React.ReactNode;
  footer?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(show);
  }, [show]);

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <ModalStyles />
      <AntdModal
        open={open}
        onClose={handleClose}
        onCancel={handleClose}
        title={header}
        children={body}
        footer={footer}
      />
    </>
  );
};
