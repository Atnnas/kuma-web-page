declare module 'react-resizable' {
    import * as React from 'react';

    export interface ResizableProps {
        children?: React.ReactNode;
        width: number;
        height: number;
        axis?: 'both' | 'x' | 'y' | 'none';
        minConstraints?: [number, number];
        maxConstraints?: [number, number];
        onResizeStop?: (e: React.SyntheticEvent, data: ResizeCallbackData) => any;
        onResizeStart?: (e: React.SyntheticEvent, data: ResizeCallbackData) => any;
        onResize?: (e: React.SyntheticEvent, data: ResizeCallbackData) => any;
        draggableOpts?: any;
        handle?: React.ReactNode | ((resizeHandle: 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne', ref: React.RefObject<any>) => React.ReactNode);
        lockAspectRatio?: boolean;
        className?: string; // Add this line
    }

    export interface ResizeCallbackData {
        node: HTMLElement;
        size: { width: number; height: number };
        handle: string;
    }

    export class Resizable extends React.Component<ResizableProps, any> { }
    export class ResizableBox extends React.Component<any, any> { }
}
