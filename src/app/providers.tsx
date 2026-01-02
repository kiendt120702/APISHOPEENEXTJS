"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UnifiedShopProvider } from "@/contexts/UnifiedShopContext";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                <TooltipProvider>
                    <UnifiedShopProvider>
                        <Toaster />
                        <Sonner />
                        {children}
                    </UnifiedShopProvider>
                </TooltipProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
