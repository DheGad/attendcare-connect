import { OperationsConsole } from "@/components/transformers/OperationsConsole";

export default function WorkerPage() {
    return (
        <div className="flex flex-col gap-6">
            <header className="mb-2">
                <h1 className="text-3xl font-light tracking-tight text-slate-800">Worker Console</h1>
                <p className="text-slate-500 font-medium mt-1">Manage active tasks and protocols.</p>
            </header>
            <OperationsConsole />
        </div>
    );
}
