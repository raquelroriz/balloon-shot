import { useRef } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
//import { MainMenu } from './game/scenes/MainMenu';


function App()
{

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    
    //const scene = phaserRef.current?.scene as MainMenu;
    
    //const star = scene.add.sprite(x, y, 'star');
   


    return (
        <div id="app">
            <PhaserGame ref={phaserRef}  />
            
        </div>
    )
}

export default App
