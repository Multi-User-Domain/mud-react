import { Thing } from '@inrupt/solid-client';

export interface IRowComponent {
    thing: Thing;
    selectHandler: (Thing) => void;
}

/**
* A generic component for rendering a list of Things, where the row to render each individual is passed as a prop
*/
export function ThingList({things, rowComponent, selectThing} : 
    {things: Thing[], rowComponent: ({thing, selectHandler} : IRowComponent) => React.ReactElement, selectThing: (Thing) => void}) : React.ReactElement {
    
        if (!things) return <div>loading...</div>;

        const rows: React.ReactElement[] = [];
        const Row = rowComponent;

        for(let i = 0; i < things.length; i++) {
            rows.push(<Row thing={things[i]} key={i} selectHandler={selectThing}/>);
        }

        return <>{rows}</>;
}
