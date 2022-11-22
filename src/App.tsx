import { FormEvent, useEffect, useRef, useState } from "react";
import Button from "./components/button";
import Modal from "./components/modal";
type TTarefas = {
  id: number;
  fazer: string;
  pronto: boolean;
};
function App() {
  const [tarefas, setTarefas] = useState<TTarefas[]>([]);
  const [deletarEmMassa, setDeletarEmMassa] = useState(false);
  const tarefasADeletarRef = useRef<string[]>();
  const tarefaSelecionadaRef = useRef<TTarefas>();
  const tarefasContainerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<{ open: () => void }>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const aoSubmeter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputRef.current?.value) {
      const { value } = inputRef.current;

      setTarefas((estadoAnterior) => [
        { id: Math.random(), fazer: value, pronto: false },
        ...(estadoAnterior || []),
      ]);
      inputRef.current.value = "";
      tarefasContainerRef.current?.scrollTo(0, 0);
    }
  };

  const abrirModal = () => {
    modalRef.current && modalRef.current.open();
  };
  const selecionarTarefa = (tarefa: TTarefas) => {
    tarefaSelecionadaRef.current = tarefa;
  };

  const aoDeletar = () =>
    setTarefas((estadoAnterior) =>
      estadoAnterior.filter(
        (tarefaAnterior) =>
          tarefaAnterior.id !== tarefaSelecionadaRef.current?.id
      )
    );

  const tornarPronto = () =>
    setTarefas((estadoAnterior) =>
      estadoAnterior.map((tarefaAnterior) => ({
        ...tarefaAnterior,
        pronto:
          tarefaSelecionadaRef.current?.id === tarefaAnterior.id
            ? !tarefaAnterior.pronto
            : tarefaAnterior.pronto,
      }))
    );

  const AodeletarEmMassa = () => setDeletarEmMassa(!deletarEmMassa);
  const aoConfirmarDelecoes = () =>
    setTarefas((estadoAnterior) =>
      estadoAnterior.filter((tarefaAnterior) =>
        tarefasADeletarRef.current?.every(
          (id) => String(tarefaAnterior.id) !== id
        )
      )
    );

  useEffect(() => {
    if (!deletarEmMassa) tarefasADeletarRef.current = [];
  }, [deletarEmMassa]);

  useEffect(() => {
    if (!tarefas.length) setDeletarEmMassa(false);

    if (tarefas.length)
      localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  useEffect(() => {
    const cacheTarefas = localStorage.getItem("tarefas");

    if (cacheTarefas) {
      setTarefas(JSON.parse(cacheTarefas));
    }
  }, []);
  return (
    <main className="bg-slate-800 min-h-screen flex flex-col items-center justify-center ">
      <div className="bg-zinc-200 p-8 rounded-xl flex flex-col gap-8 min-w-[18.75rem]">
        <h1 className="text-2xl text-slate-200 bg-indigo-700 p-2 rounded text-center">
          Tarefas:
        </h1>
        <Button
          onClick={AodeletarEmMassa}
          disabled={!deletarEmMassa && tarefas.length < 2}
          className={`btn-red ${deletarEmMassa ? "bg-red-500" : ""}`}
        >
          Deletar em massa
        </Button>
        <div
          ref={tarefasContainerRef}
          className={
            tarefas.length
              ? "overflow-y-auto max-h-80 flex flex-col gap-6 bg-zinc-700 p-4 rounded"
              : ""
          }
        >
          {tarefas.map((tarefa) => (
            <div
              className="bg-indigo-700 p-2 rounded  text-slate-200 flex justify-between items-center gap-4 text-xl"
              key={tarefa.id}
            >
              <span className={tarefa.pronto ? "line-through " : "font-bold"}>
                {tarefa.fazer}
              </span>
              <div onClick={() => selecionarTarefa(tarefa)}>
                {!deletarEmMassa ? (
                  <>
                    <Button onClick={abrirModal} className="btn-red">
                      Deletar
                    </Button>
                    <Button
                      onClick={tornarPronto}
                      className={`btn-slate ml-4 ${
                        tarefa.pronto ? "bg-emerald-800" : ""
                      }`}
                    >
                      Feito
                    </Button>
                  </>
                ) : (
                  <input
                    className="h-5 w-5 "
                    onChange={(e) => {
                      if (e.target.checked) {
                        tarefasADeletarRef.current = [
                          ...(tarefasADeletarRef.current || []),
                          String(tarefa.id),
                        ];
                      } else {
                        tarefasADeletarRef.current =
                          tarefasADeletarRef.current?.filter(
                            (id) => id !== String(tarefa.id)
                          );
                      }
                    }}
                    type="checkbox"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        {!deletarEmMassa ? (
          <form onSubmit={aoSubmeter} className="flex flex-col gap-2">
            <label htmlFor="input-tarefa">Nome da tarefa:</label>
            <input
              required
              maxLength={30}
              ref={inputRef}
              className="p-2 rounded text-xl bg-zinc-700 text-slate-200 uppercase"
              id="input-tarefa"
            />
            <Button className="btn-cyan mt-3">Adicionar tarefa</Button>
          </form>
        ) : (
          <Button className="btn-red" onClick={aoConfirmarDelecoes}>
            Confirmar deleções
          </Button>
        )}
      </div>
      <Modal aoDeletar={aoDeletar} ref={modalRef} />
    </main>
  );
}

export default App;
