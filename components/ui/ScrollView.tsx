"use client";

import { forwardRef } from "react";

interface ScrollViewProps {
    children: React.ReactNode;
}
export const ScrollView = forwardRef<HTMLDivElement, ScrollViewProps>(
    ({ children }, ref) => {
        const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            const container = e.currentTarget;
            container.dataset.isDragging = "true";
            container.dataset.startX = String(e.pageX - container.offsetLeft);
            container.dataset.scrollLeft = String(container.scrollLeft);
        };

        const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            const container = e.currentTarget;
            if (container.dataset.isDragging === "true") {
                e.preventDefault();
                e.stopPropagation();
                const x = e.pageX - container.offsetLeft;
                const scroll = x - Number(container.dataset.startX);
                container.scrollLeft =
                    Number(container.dataset.scrollLeft) - scroll;
            }
        };

        const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.dataset.isDragging = "false";
        };

        return (
            <div
                ref={ref}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2 active:cursor-grabbing select-none cursor-grab"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
            >
                {children}
            </div>
        );
    },
);

ScrollView.displayName = "ScrollView";
