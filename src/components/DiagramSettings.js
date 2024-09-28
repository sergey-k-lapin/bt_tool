import { observer } from 'mobx-react-lite';
import React from 'react';
import { toolbarStore } from '../data/toolbarStore';


const DiagramSettings = () => {
    return <>
        <div className='diagram-settings'>
            <select onChange={(e) => {
                toolbarStore.setDragType(e.target.value);
            }}>
                <option key='0' value={''}>Drag arrow</option>
                <option key='1' value={'node'}>Drag node</option>
            </select>
            <select onChange={(e) => {
                toolbarStore.setPanType(e.target.value);
            }}>
                <option key='0' value={'scroll'}>Scroll view</option>
                <option key='1' value={'drag'}>Drag view</option>
            </select>

        </div>
    </>
}

export default DiagramSettings;