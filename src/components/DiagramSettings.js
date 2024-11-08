import React, { useState } from 'react';
import { toolbarStore } from '../data/toolbarStore';


const DiagramSettings = () => {
    const [open, setOpen] = useState(false);

    let controls = null;
    if (open) {
        controls = <>
            <select onChange={(e) => {
                toolbarStore.setDragType(e.target.value);
                setOpen( false );
                }}
                value={toolbarStore.dragType}
            >
                <option key='0' value={''}>Drag arrow</option>
                <option key='1' value={'node'}>Drag node</option>
            </select>
            <select onChange={(e) => {
                toolbarStore.setPanType(e.target.value);
                setOpen( false );
                }}
                value={toolbarStore.panType}
            >
                <option key='0' value={'scroll'}>Scroll view</option>
                <option key='1' value={'drag'}>Drag view</option>
            </select>
        </>
    }
    return <>
        <div className='diagram-settings'>
            <button
                onClick={() => { setOpen( !open ) }}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    height="2em"
                    width="2em"
                >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M2.132 13.63a9.942 9.942 0 010-3.26c1.102.026 2.092-.502 2.477-1.431.385-.93.058-2.004-.74-2.763a9.942 9.942 0 012.306-2.307c.76.798 1.834 1.125 2.764.74.93-.385 1.457-1.376 1.43-2.477a9.942 9.942 0 013.262 0c-.027 1.102.501 2.092 1.43 2.477.93.385 2.004.058 2.763-.74a9.942 9.942 0 012.307 2.306c-.798.76-1.125 1.834-.74 2.764.385.93 1.376 1.457 2.477 1.43a9.942 9.942 0 010 3.262c-1.102-.027-2.092.501-2.477 1.43-.385.93-.058 2.004.74 2.763a9.942 9.942 0 01-2.306 2.307c-.76-.798-1.834-1.125-2.764-.74-.93.385-1.457 1.376-1.43 2.477a9.942 9.942 0 01-3.262 0c.027-1.102-.501-2.092-1.43-2.477-.93-.385-2.004-.058-2.763.74a9.942 9.942 0 01-2.307-2.306c.798-.76 1.125-1.834.74-2.764-.385-.93-1.376-1.457-2.477-1.43zM12 15a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
            </button>
            {controls}
        </div>
    </>
}

export default DiagramSettings;