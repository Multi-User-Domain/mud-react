import { Thing } from '@inrupt/solid-client';

export interface IRowComponent {
    thing: Thing;
    selectHandler: (Thing) => void;
}

export interface IThingList {
    things: Thing[];
    filter?: (things: Thing[]) => Thing[];
    rowComponent: ({thing, selectHandler} : IRowComponent) => React.ReactElement;
    selectThing: (Thing) => void;
}

/**
* A generic component for rendering a list of Things, where the row to render each individual is passed as a prop
*/
export function ThingList({things, filter=null, rowComponent, selectThing} : IThingList) : React.ReactElement {
    
        if (!things) return <div>loading...</div>;
        if(filter != null) things = filter(things);

        const rows: React.ReactElement[] = [];
        const Row = rowComponent;

        for(let i = 0; i < things.length; i++) {
            rows.push(<Row thing={things[i]} key={i} selectHandler={selectThing}/>);
        }

        return <>{rows}</>;
}
