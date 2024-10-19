// app/page.js

"use client"
import { useEffect, useMemo, useState } from "react";
import Image from 'next/image';
import socketio from "socket.io-client";

import axios from "axios";




const mapData = {
  "cs_italy": { PosX: -2647, PosY: 2592, Scale: 4.6 },
  "cs_office": { PosX: -1838, PosY: 1858, Scale: 4.1 },
  "de_ancient": { PosX: -2953, PosY: 2164, Scale: 5.0 },
  "de_anubis": { PosX: -2796, PosY: 3328, Scale: 5.22 },
  "de_dust2": { PosX: -2476, PosY: 3239, Scale: 4.4 },
  "de_inferno": { PosX: -2087, PosY: 3870, Scale: 4.9 },
  "de_mirage": { PosX: -3230, PosY: 1713, Scale: 5.0 },
  "de_nuke": { PosX: -3453, PosY: 2887, Scale: 7.0 },
  "de_overpass": { PosX: -4831, PosY: 1781, Scale: 5.2 },
  "de_vertigo": { PosX: -3168, PosY: 1762, Scale: 4.0 },
};


//function to calculate the center of the screen
function centerScreen() {
  return [window.innerWidth / 2, window.innerHeight / 2]
}

//function to calculate where the topleft of the map should be on screen, knowing all pictures are 1024x1024
function topLeft() {
  let center_screen = centerScreen();

  return [center_screen[0] - 512,center_screen[1] - 512]
}


//function to calculate the pos relative to the world origin, then translate this into map coords, given that world origin is the center and a map origin is the topleft
function worldToMap(worldPos, mapName) {

  const map = mapData[mapName];
  if (!map) {
    return [0, 0];
  }


  const { PosX, PosY, Scale } = map;

  const top_left_world = [PosX, PosY];

  let worldX = worldPos[0] - top_left_world[0];
  let worldY = top_left_world[1] - worldPos[1];

  let mapX = worldX / Scale
  let mapY = worldY / Scale

  return [mapX, mapY];
}


//function to translate map to screen
function mapToScreen(mapPos) {
  let screenMapPos = topLeft();

  screenMapPos[0] += mapPos[0];
  screenMapPos[1] += mapPos[1];
  return screenMapPos;

}

export default function Home() {

    const socket = socketio.connect("http://localhost:4000")

    useEffect(() => {
        socket.on('connect', () => {
            console.log(`Connected to server`);
        })

        socket.on("new_map", (data) => {
          console.log(`setting map name`);
          console.log(data.name);

          setMapname(data.name);
        })

        socket.on("new_players", (data) => {
          console.log(`setting players`);
          console.log(data.players);

          setPlayerDict(data.players);
        })

        socket.on('disconnect', () => {
            console.log(`Disconnected from server`);
        })
    }, [socket])

    const [mapName, setMapname] = useState("");




    const [mapPath, setMapPath] = useState("");

    const [playerDict, setPlayerDict] = useState({});

    const [mapPos, setMapPos] = useState([]);

    const [htnl_arr, setHtmlArr] = useState([]);


    //use effect for window size hook
    useEffect(() => {
        function handleResize() {
          setMapPos(topLeft());
        }

        //set starting size
        setMapPos(topLeft());

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [])


    //useeffect for switching the imgpath for the map
    useEffect(() => {
        switch(mapName){
          case "de_dust2":
            setMapPath("/imgs/de_dust2.png");
            break;
          case "de_mirage":
            setMapPath("/imgs/de_mirage.png");
            break;
          case "de_inferno":
            setMapPath("/imgs/de_inferno.png");
            break;
          case "de_nuke":
            setMapPath("/imgs/de_nuke.png");
            break;
          case "de_overpass":
            setMapPath("/imgs/de_overpass.png");
            break;
          case "de_anubis":
            setMapPath("/imgs/de_anubis.png");
            break;
          case "de_vertigo":
            setMapPath("/imgs/de_vertigo.png");
            break;
          case "de_ancient":
            setMapPath("/imgs/de_ancient.png");
            break;
          case "cs_office":
            setMapPath("/imgs/cs_office.png");
            break;
          case "cs_italy":
            setMapPath("/imgs/cs_italy.png");
            break;
          default:
            setMapPath("/imgs/de_dust2.png");
            break;
        }
    }, [mapName])


    let test_player = worldToMap([-1780.55, -660.03], "de_dust2");
    console.log(test_player)

    let map_player = mapToScreen(test_player);
    console.log(map_player)


    //axios.get localhost:4000/getmap stored in setmap
    const setMap = async () => {
        console.log("setting default map")
        const res = await axios.get("http://localhost:4000/getmap");
        setMapname(res.data.name);
    }

    setMap()



    //use effect on playerlist
    useEffect(() => {
      let new_html_arr = []

      for (const [key, value] of Object.entries(playerDict)) {
        let player = worldToMap(value, mapName);
        let player_screen = mapToScreen(player);

        new_html_arr.push(<div className="absolute w-2 h-2 bg-red-500 rounded-full" style={{top: player_screen[1], left: player_screen[0]}}></div>)
        //add name a line under
        new_html_arr.push(<div className="absolute" style={{top: player_screen[1] + 10, left: player_screen[0]}}>{key}</div>)
      }

      setHtmlArr(new_html_arr);
    }, [playerDict, mapName])


    return (
        <main className="grid grid-cols-2 p-24 gap-6">

            {/* display the current mapname */}
            <div>
                <h1>Current Map: {mapName}</h1>
            </div>

            <div className="absolute top-0 left-0 min-w-full min-h-screen">
            <Image src={mapPath} alt="maploading failure" priority width={1024} height={1024} className="absolute" style={{top: mapPos[1], left: mapPos[0]}}/>
            </div>


            <div className="absolute top-0 left-0 min-w-full min-h-screen">
              {htnl_arr}
            </div>


        </main>
    );
}
