import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Button from "./button";

type TModalRef = {
  open: () => void;
};
type TModal = {
  aoDeletar: () => void;
};
export default forwardRef<TModalRef, TModal>(function Modal(
  { aoDeletar },
  ref
) {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
  }));

  useEffect(() => {
    console.log(isOpen);
  }, [isOpen]);

  const fecharModal = () => setIsOpen(false);
  return (
    <div
      className={`min-h-screen absolute top-0 left-0 w-screen flex justify-center items-center bg-slate-800/50 z-10 ease-in-out duration-300 ${
        !isOpen
          ? "opacity-0 pointer-events-none"
          : "opacity-100 pointer-events-auto"
      }`}
      onClick={fecharModal}
    >
      <div className="p-4 bg-white flex flex-col gap-4 rounded">
        <h1>Tem certeza que deseja deletar a tarefa?</h1>

        <Button onClick={fecharModal} className="btn-slate">
          Cancelar
        </Button>
        <Button onClick={() => aoDeletar()} className="btn-red">
          Deletar
        </Button>
      </div>
    </div>
  );
});
