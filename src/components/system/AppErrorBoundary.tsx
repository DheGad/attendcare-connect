"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class AppErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-900/20 border border-red-500 rounded-xl m-8 text-white">
                    <h2 className="text-xl font-bold text-red-500 mb-4">React Rendering Error</h2>
                    <pre className="text-sm overflow-auto text-red-300">
                        {this.state.error?.message}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}
