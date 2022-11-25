import { useRef, useState } from "react";

type TTarefa = {
  id: number;
  tarefa: string;
  pronto: boolean;
};

function App() {
  const [tarefas, setTarefas] = useState<TTarefa[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const criarTarefa = () => {
    if (inputRef.current) {
      setTarefas([
        { id: Math.random(), tarefa: inputRef.current.value, pronto: false },
        ...tarefas,
      ]);

      inputRef.current.value = "";
    }
  };

  const tornarTarefaPronto = (id: number) => {
    setTarefas(
      tarefas.map((tarefa) => ({
        id: tarefa.id,
        tarefa: tarefa.tarefa,
        pronto: tarefa.id === id ? !tarefa.pronto : tarefa.pronto,
      }))
    );
  };

  const deletarTarefa = (id: number) => {
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-700 flex items-center justify-center px-6">
      <div className="bg-slate-200 p-4 rounded-lg flex flex-col gap-4 w-full max-w-md ">
        <h1>Tarefas:</h1>
        {tarefas.length > 0 && (
          <div className="bg-slate-700 p-2 rounded-md flex flex-col gap-4 max-h-80 overflow-auto">
            {tarefas.map((tarefa) => (
              <div
                className="bg-sky-600 rounded-md p-2 flex justify-between items-center"
                key={tarefa.id}
              >
                <span
                  className={
                    tarefa.pronto
                      ? "line-through font-bold text-emerald-100"
                      : ""
                  }
                >
                  {tarefa.tarefa}
                </span>
                <div className="flex">
                  <button
                    onClick={() => tornarTarefaPronto(tarefa.id)}
                    className={
                      tarefa.pronto ? "bg-emerald-800" : "bg-slate-800"
                    }
                  >
                    Pronto
                  </button>
                  <button
                    onClick={() => deletarTarefa(tarefa.id)}
                    className="bg-red-800 ml-3"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            criarTarefa();
          }}
          className="flex flex-col gap-4"
        >
          <input ref={inputRef} maxLength={32} required />
          <button className="bg-emerald-800">Criar tarefa</button>
        </form>
      </div>
    </div>
  );
}

export default App;
