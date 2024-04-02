import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { Canvas, useFrame, useLoader} from "@react-three/fiber";
import { useGLTF, PerspectiveCamera, Text, Html } from "@react-three/drei";
import eventBus from "../../../../../assets/scripts/utils/eventBus";
import animateTitle from "../../../../../assets/scripts/utils/animations/pages/index/title";
import useMediaQuery from "../../../../../assets/scripts/hooks/useMediaQuery";

import VideoOne from "../../../../../../public/videos/pages/index/video_one.mp4";
import VideoTwo from "../../../../../../public/videos/pages/index/video_two.mp4";
import VideoThree from "../../../../../../public/videos/pages/index/video_three.mp4";
import RommText from "../../../../../../public/videos/pages/index/empty.png";

const degreesToRadians = (degrees) => {
  var pi = Math.PI;
  return degrees * (pi / 180);
};

const Tooltip = (props) => {
  const tooltip = useRef();
  const { position, text, onClick } = props;

  useEffect(() => {
  }, []);

  const onHover = (e) => {
    eventBus.dispatch("uRoomVideo", props.video);
    gsap.fromTo(
      tooltip.current.querySelector("p"),
      {
        opacity: 0,
        translateY: 10,
      },
      { opacity: 1, translateY: 0 }
    );
  };

  const onLeave = (e) => {
    eventBus.dispatch("uRoomVideo", null);
    gsap.fromTo(
      tooltip.current.querySelector("p"),
      {
        opacity: 1,
      },
      { opacity: 0 }
    );
  };
  return (
    <>
      <Html
        as="div"
        position={position ? position : [-0.9, 0.5, 0]}
        className="do-react-tooltip"
        ref={tooltip}
      >
        {text && (
          <p
            style={{
              color: "white",
              position: "absolute",
              top: "-64px",
              left: "25px",
              transform: "translate(-50%, 0)",
              background: "rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              borderRadius: "4px",
              padding: "8px",
              fontSize: "20px",
              opacity: 0,
            }}
          >
            {text}
          </p>
        )}
        <svg
          width="49"
          height="49"
          viewBox="0 0 49 49"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.preventDefault();
            onHover(e);
          }}
          onMouseLeave={(e) => {
            e.preventDefault();
            onLeave();
          }}
          onClick={onClick}
        >
          <path
            opacity="0.5"
            d="M24 47.5C36.9787 47.5 47.5 36.9787 47.5 24C47.5 11.0213 36.9787 0.5 24 0.5C11.0213 0.5 0.5 11.0213 0.5 24C0.5 36.9787 11.0213 47.5 24 47.5Z"
            fill="black"
            stroke="white"
            strokeMiterlimit="10"
          />
          <path
            d="M39.6 24C31 23.9 23.9 31 24 39.6V39.2C23.9 30.7 17 23.9 8.5 24H8.6C17.1 23.9 23.9 17 24 8.6V8.5C24 17.1 31 24 39.6 24Z"
            fill="white"
          />
        </svg>
      </Html>
    </>
  );
};

const BlenderScene = (props) => {
  const { nodes, materials } = useGLTF("3d/models/blenderScene.glb");

  const videoScreen = React.useRef();
  const [videoOne, setVideoOne] = React.useState(() =>
    Object.assign(document.createElement("video"), {
      src: VideoOne,
      loop: true,
      muted: true,
      crossOrigin: "Anonymous",
    })
  );

  const [videoTwo, setVideoTwo] = React.useState(() =>
    Object.assign(document.createElement("video"), {
      src: VideoTwo,
      loop: true,
      muted: true,
      crossOrigin: "Anonymous",
    })
  );

  const [videoThree, setVideoThree] = React.useState(() =>
    Object.assign(document.createElement("video"), {
      src: VideoThree,
      loop: true,
      muted: true,
      crossOrigin: "Anonymous",
    })
  );

  const [roomVideo, setRoomVideo] = React.useState(0);
  const texture = useLoader(THREE.TextureLoader, RommText.src);
  texture.flipX = true;
  texture.center.set(0.185, 0.295);
  texture.repeat.set(-4, 3);
  texture.rotation = -degreesToRadians(90);
  const [basePlatform, setBasePlatform] = React.useState(-85);

  // Mobile part
  const table = React.useRef();
  const objects = [{}, {}, {}];
  const radius = 10;
  const step = (2 * Math.PI) / objects.length;
  let angle = 0;

  for (const object of objects) {
    object.position = [radius * Math.cos(angle), 0, radius * Math.sin(angle)];
    object.angle = angle;
    angle += step;
  }

  React.useEffect(() => {
    videoOne.play();
    videoTwo.play();
    videoThree.play();
  }, [videoOne, videoTwo, videoThree]);

  React.useEffect(() => {
    eventBus.on("uRoomVideo", (data) => {
      setRoomVideo(data);
    });
    gsap.to('.canvas', {opacity: 1, translateY: "16px", delay: "300ms"});
  }, []);

  React.useEffect(() => {
    if (props.isMobile) {
      setRoomVideo(1);
    } else {
      setRoomVideo(0);
    }
  }, [props.isMobile]);

  React.useEffect(() => {
    eventBus.on("slide-left", () => {
      /* setBasePlatform((value) => {
         return value + 120;
       });
       setRoomVideo((value) => {
         if (value === 3) {
           return 1;
         }
         return value + 1;
       });
       setRoomVideo((value) => {
         console.log(value);
         return value;
       }); */
      // console.log(table);

      setBasePlatform((value) => {
        gsap.to(table.current.rotation, {
          y: degreesToRadians(value + 120), onComplete: () => {
            setBasePlatform((value) => {
              return value + 120;
            });
          }
        });
        return value;
      });
      setRoomVideo((value) => {
        if (value === 3) {
          return 1;
        }
        return value + 1;
      });
      setRoomVideo((value) => {
        console.log(value);
        return value;
      });
    });

    eventBus.on("slide-right", () => {
      /* setBasePlatform((value) => {
         return value - 120;
       });
       setRoomVideo((value) => {
         if (value === 1) {
           return 3;
         }
         return value - 1;
       });
 
       setRoomVideo((value) => {
         console.log(value);
         return value;
       }); */
      setBasePlatform((value) => {
        gsap.to(table.current.rotation, {
          y: degreesToRadians(value - 120), onComplete: () => {
            setBasePlatform((value) => {
              return value - 120;
            });
          }
        });
        return value;
      });
      setRoomVideo((value) => {
        if (value === 1) {
          return 3;
        }
        return value - 1;
      });

      setRoomVideo((value) => {
        console.log(value);
        return value;
      });

    });
    //console.log(table);
  }, []);

  const moveCamera = ({ location, targetLocation, rotation }) => {
    const animation = (camera) => {
      console.log(camera);
      gsap.to(camera.position, {
        x: targetLocation[0],
        y: targetLocation[1],
        z: targetLocation[2],
        duration: 0.8,
        onComplete: () => {
          location();
        },
      });
      gsap.to("main", { opacity: 0, delay: 0.2 });
    };
    eventBus.dispatch("animCamera", animation);
  };

  return (
    <group {...props} dispose={null}>
      <group
        ref={table}
        rotation={
          !props.isMobile ? [0, 0, 0] : [0, degreesToRadians(basePlatform), 0]
        }
        position={!props.isMobile ? [0, 0, 0] : [-0.8, 0, 0]}
      >
        <group
          name="TV"
          position={!props.isMobile ? [-0.02, 0, -0.02] : objects[0].position}
          rotation={props.isMobile ? [0, degreesToRadians(90), 0] : [0, 0, 0]}
        >
          <group name="Antenne001" position={[1.38, 1.01, -0.27]}>
            <mesh
              name="Cylinder013"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder013.geometry}
              material={materials["tvFrame.002"]}
            />
            <mesh
              name="Cylinder013_1"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder013_1.geometry}
              material={materials["tvBody.002"]}
            />
          </group>
          <group name="Body001" position={[0.02, 0, 0.02]} scale={[1.5, 1, 1]}>
            <mesh
              name="Cube005"
              castShadow
              receiveShadow
              geometry={nodes.Cube005.geometry}
              material={materials["tvBody.003"]}
            />
            <mesh
              name="Cube005_1"
              castShadow
              receiveShadow
              geometry={nodes.Cube005_1.geometry}
              material={materials["tvFrame.003"]}
            />
            <mesh
              name="Cube005_2"
              castShadow
              receiveShadow
              geometry={nodes.Cube005_2.geometry}
              material={materials["tvScreenFrame.003"]}
            />
            <mesh
              name="Cube005_3"
              castShadow
              receiveShadow
              geometry={nodes.Cube005_3.geometry}
              material={nodes.Cube005_3.material}
            />
          </group>
          <group
            name="Cursor001"
            position={[1.08, 0.27, 1.03]}
            rotation={[Math.PI / 2, Math.PI / 2, 0]}
            scale={[0.76, 0.1, 0.76]}
          >
            <mesh
              name="Cylinder012"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder012.geometry}
              material={materials["tvBody.002"]}
            />
            <mesh
              name="Cylinder012_1"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder012_1.geometry}
              material={materials["tvFrame.002"]}
            />
          </group>
          <group
            name="Cursor2001"
            position={[1.07, 0.67, 1.03]}
            rotation={[Math.PI / 2, Math.PI / 2, 0]}
            scale={[0.76, 0.1, 0.76]}
          >
            <mesh
              name="Cylinder012"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder012.geometry}
              material={materials["tvBody.002"]}
            />
            <mesh
              name="Cylinder012_1"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder012_1.geometry}
              material={materials["tvFrame.002"]}
            />
          </group>
          <mesh
            name="Power001"
            castShadow
            receiveShadow
            geometry={nodes.Power001.geometry}
            material={materials["tvFrame.002"]}
            position={[1.35, -0.01, 1.01]}
            rotation={[Math.PI / 2, Math.PI / 2, 0]}
          />
          <mesh
            name="Screen001"
            castShadow
            receiveShadow
            geometry={nodes.Screen001.geometry}
            // material={materials["tvScreen.002"]}
            position={[0.02, 0, 0.02]}
            scale={[1.5, 1, 1]}
          >
            <meshBasicMaterial toneMapped={false}>
              <videoTexture
                attach={"map"}
                args={[videoOne]}
                encoding={THREE.sRGBEncoding}
                rotation={-1.5708}
                repeat={[-2.5, 2.5]}
                offset={[1.025, -0]}
                center={[0.5, 0.5]}
              />
            </meshBasicMaterial>
          </mesh>
          <mesh
            name="Signature001"
            castShadow
            receiveShadow
            geometry={nodes.Signature001.geometry}
            material={materials["mainBrand.001"]}
            position={[1.26, 1, 0.92]}
          />
          {
            <Tooltip
              text="Photography"
              video={1}
              targetLocation={[0.02, -0, 0.02]}
             // position={[-1.5, -1, 0]}
              onClick={() => {
                var getUrl = window.location;
                var baseUrl =
                  getUrl.protocol +
                  "//" +
                  getUrl.host +
                  "/" +
                  getUrl.pathname.split("/")[1] + "projects/";

                moveCamera({
                  location: () => {
                    window.location.href = baseUrl + "photography/";
                  },
                  targetLocation: [-0.02, 0, -0.02],
                  rotation: null,
                });
              }}
            />
          }
        </group>
        <group
          name="TV001"
          position={!props.isMobile ? [5.79, 0, 0.25] : objects[1].position}
          rotation={
            !props.isMobile ? [0, -0.38, 0] : [0, degreesToRadians(-35), 0]
          }
        >
          <group name="Antenne002" position={[1.39, 1.01, 0.43]}>
            <mesh
              name="Cylinder013"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder013.geometry}
              material={materials["tvFrame.002"]}
            />
            <mesh
              name="Cylinder013_1"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder013_1.geometry}
              material={materials["tvBody.002"]}
            />
          </group>
          <group name="Body002" position={[0.03, 0, 0.19]} scale={[1.5, 1, 1]}>
            <mesh
              name="Cube005"
              castShadow
              receiveShadow
              geometry={nodes.Cube005.geometry}
              material={materials["tvBody.003"]}
            />
            <mesh
              name="Cube005_1"
              castShadow
              receiveShadow
              geometry={nodes.Cube005_1.geometry}
              material={materials["tvFrame.003"]}
            />
            <mesh
              name="Cube005_2"
              castShadow
              receiveShadow
              geometry={nodes.Cube005_2.geometry}
              material={materials["tvScreenFrame.003"]}
            />
            <mesh
              name="Cube005_3"
              castShadow
              receiveShadow
              geometry={nodes.Cube005_3.geometry}
              material={nodes.Cube005_3.material}
            />
          </group>
          <group
            name="Cursor002"
            position={[0.63, 0.27, 1.53]}
            rotation={[0, 1.19, Math.PI / 2]}
            scale={[0.76, 0.1, 0.76]}
          >
            <mesh
              name="Cylinder012"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder012.geometry}
              material={materials["tvBody.002"]}
            />
            <mesh
              name="Cylinder012_1"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder012_1.geometry}
              material={materials["tvFrame.002"]}
            />
          </group>
          <group
            name="Cursor2002"
            position={[0.62, 0.67, 1.52]}
            rotation={[Math.PI / 2, Math.PI / 2, 0]}
            scale={[0.76, 0.1, 0.76]}
          >
            <mesh
              name="Cylinder012"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder012.geometry}
              material={materials["tvBody.002"]}
            />
            <mesh
              name="Cylinder012_1"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder012_1.geometry}
              material={materials["tvFrame.002"]}
            />
          </group>
          <mesh
            name="Power002"
            castShadow
            receiveShadow
            geometry={nodes.Power002.geometry}
            material={materials["tvFrame.002"]}
            position={[0.89, -0.01, 1.6]}
            rotation={[Math.PI / 2, Math.PI / 2, 0]}
          />
          <mesh
            name="Screen002"
            castShadow
            receiveShadow
            geometry={nodes.Screen002.geometry}
            // material={materials["tvScreen.002"]}
            position={[0.03, 0, 0.19]}
            scale={[1.5, 1, 1]}
          >
            <meshBasicMaterial toneMapped={false}>
              <videoTexture
                attach={"map"}
                args={[videoTwo]}
                encoding={THREE.sRGBEncoding}
                rotation={-1.5708}
                repeat={[-2.5, 2.5]}
                offset={[1.025, -0]}
                center={[0.5, 0.5]}
              />
            </meshBasicMaterial>
          </mesh>
          <mesh
            name="Signature002"
            castShadow
            receiveShadow
            geometry={nodes.Signature002.geometry}
            material={materials["mainBrand.001"]}
            position={[0.84, 1, 1.49]}
          />
          {
            <Tooltip
              text="Development"
              video={2}
              targetLocation={[0.03, 0, 0.19]}
              onClick={() => {
                var getUrl = window.location;
                var baseUrl =
                  getUrl.protocol +
                  "//" +
                  getUrl.host +
                  "/" +
                  getUrl.pathname.split("/")[1] + "projects/";

                moveCamera({
                  location: () => {
                    window.location.href = baseUrl + "development/";
                  },
                  targetLocation: [5.79, 0, 0.25],
                  rotation: null,
                });
              }}
            />
          }
        </group>
        <group
          name="TV002"
          position={!props.isMobile ? [-6.42, 0, 1.08] : objects[2].position}
          rotation={
            !props.isMobile ? [0, 0.49, 0] : [0, degreesToRadians(205), 0]
          }
        >
          <group name="Antenne003" position={[1.06, 1.01, -0.78]}>
            <mesh
              name="Cylinder013"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder013.geometry}
              material={materials["tvFrame.002"]}
            />
            <mesh
              name="Cylinder013_1"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder013_1.geometry}
              material={materials["tvBody.002"]}
            />
          </group>
          <group name="Body003" position={[0, 0, 0.11]} scale={[1.5, 1, 1]}>
            <mesh
              name="Cube005"
              castShadow
              receiveShadow
              geometry={nodes.Cube005.geometry}
              material={materials["tvBody.003"]}
            />
            <mesh
              name="Cube005_1"
              castShadow
              receiveShadow
              geometry={nodes.Cube005_1.geometry}
              material={materials["tvFrame.003"]}
            />
            <mesh
              name="Cube005_2"
              castShadow
              receiveShadow
              geometry={nodes.Cube005_2.geometry}
              material={materials["tvScreenFrame.003"]}
            />
            <mesh
              name="Cube005_3"
              castShadow
              receiveShadow
              geometry={nodes.Cube005_3.geometry}
              material={nodes.Cube005_3.material}
            />
          </group>
          <group
            name="Cursor003"
            position={[1.41, 0.27, 0.51]}
            rotation={[Math.PI / 2, Math.PI / 2, 0]}
            scale={[0.76, 0.1, 0.76]}
          >
            <mesh
              name="Cylinder012"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder012.geometry}
              material={materials["tvBody.002"]}
            />
            <mesh
              name="Cylinder012_1"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder012_1.geometry}
              material={materials["tvFrame.002"]}
            />
          </group>
          <group
            name="Cursor2003"
            position={[1.41, 0.67, 0.51]}
            rotation={[Math.PI / 2, Math.PI / 2, 0]}
            scale={[0.76, 0.1, 0.76]}
          >
            <mesh
              name="Cylinder012"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder012.geometry}
              material={materials["tvBody.002"]}
            />
            <mesh
              name="Cylinder012_1"
              castShadow
              receiveShadow
              geometry={nodes.Cylinder012_1.geometry}
              material={materials["tvFrame.002"]}
            />
          </group>
          <mesh
            name="Power003"
            castShadow
            receiveShadow
            geometry={nodes.Power003.geometry}
            material={materials["tvFrame.002"]}
            position={[1.64, -0.01, 0.35]}
            rotation={[Math.PI / 2, Math.PI / 2, 0]}
          />
          <mesh
            name="Screen003"
            castShadow
            receiveShadow
            geometry={nodes.Screen003.geometry}
            // material={materials["tvScreen.002"]}
            position={[0, 0, 0.11]}
            scale={[1.5, 1, 1]}
          >
            <meshBasicMaterial toneMapped={false}>
              <videoTexture
                attach={"map"}
                args={[videoThree]}
                encoding={THREE.sRGBEncoding}
                rotation={-1.5708}
                repeat={[-2.5, 2.5]}
                offset={[1.025, -0]}
                center={[0.5, 0.5]}
              />
            </meshBasicMaterial>
          </mesh>
          <mesh
            name="Signature003"
            castShadow
            receiveShadow
            geometry={nodes.Signature003.geometry}
            material={materials["mainBrand.001"]}
            position={[1.52, 1, 0.32]}
          />
          {
            <Tooltip
              text="Design"
              video={3}
              targetLocation={[0, 0, 0.11]}
              onClick={() => {
                var getUrl = window.location;
                var baseUrl =
                  getUrl.protocol +
                  "//" +
                  getUrl.host +
                  "/" +
                  getUrl.pathname.split("/")[1] + "projects/";

                moveCamera({
                  location: () => {
                    window.location.href = baseUrl + "design/";
                  },
                  targetLocation: [-6.42, 0, 1.08],
                  rotation: null,
                });
              }}
            />
          }
        </group>
      </group>

      <mesh
        name="RoomScreen"
        castShadow
        receiveShadow
        geometry={nodes.RoomScreen.geometry}
        // material={materials["tvScreen.004"]}
        position={[0.06, 6.19, -18.31]}
        rotation={[-Math.PI / 2, -Math.PI / 2, 0]}
        ref={videoScreen}
        scale={props.isMobile ? 0.5 : 1}
      >
        {roomVideo != 0 && (
          <meshBasicMaterial toneMapped={false}>
            {roomVideo && (
              <videoTexture
                attach={"map"}
                args={[
                  (roomVideo === 1 && videoOne) ||
                  (roomVideo === 2 && videoTwo) ||
                  (roomVideo === 3 && videoThree),
                ]}
                encoding={THREE.sRGBEncoding}
                rotation={-1.5708}
                repeat={[-3.5, 2.5]}
                offset={[0.45, 0.625]}
                center={[0.5, 0.5]}
              />
            )}
          </meshBasicMaterial>
        )}
        {!roomVideo && (
          <meshBasicMaterial toneMapped={false} attach="material" map={texture}>
          </meshBasicMaterial>
        )}
      </mesh>
      <mesh
        name="Plane"
        castShadow
        receiveShadow
        geometry={nodes.Plane.geometry}
        position={[0, -1.18, 0]}
        scale={100}
      >
        <meshBasicMaterial attach="material" color="black" />
      </mesh>
    </group>
  );
};

const getAspect = () => {
  return window.innerWidth / window.innerHeight;
};

const mouseAnimation = (object, isMobile) => {
  document.addEventListener("mousemove", (event) => {
    if (window.innerWidth > 425 && (object.current)) {
      object.current.position.x =
        0 +
        (event.clientX > window.innerWidth / 2
          ? (event.clientX - window.innerWidth / 2) * 0.002
          : -(window.innerWidth / 2 - event.clientX) * 0.002);
      object.current.position.y =
        10 +
        (event.clientY > window.innerWidth / 2
          ? (event.clientY - window.innerWidth / 2) * 0.001
          : -(window.innerWidth / 2 - event.clientY) * 0.001);
    }
  });
};

const Scene = () => {
  const isMobile = useMediaQuery("(max-width: 425px)");
  const [cameraAspect, setCameraAspect] = React.useState(16 / 9);
  const camera = React.useRef();
  const track = React.useRef();

  // drag stuffs
  const [navigable, setNavigable] = React.useState(false);
  const [dragStart, setDragStart] = React.useState();
  const [isDrag, setIsDrag] = React.useState(false);
  const [dragActivity, setDragActivity] = React.useState();

  const startDrag = (el, event) => {
    // Get the drag start value
    setDragStart(event.clientX);
    // Set isDrag to true for initialisation
    setIsDrag(true);
  };

  const onDrag = (el, event) => {
    if (isDrag && event) {
      setDragActivity(event.clientX);
      eventBus.dispatch("slide-position", {
        position: dragStart - event.clientX,
      });
    }
  };

  const endDrag = (el, event) => {
    if (dragStart - dragActivity > 70) {
      // go to left
      eventBus.dispatch("slide-left");
    } else if (dragStart - dragActivity < -70) {
      // go to right
      eventBus.dispatch("slide-right");
    }

    setIsDrag(false);
  };

  const handleDrag = (event, step) => {
    if (navigable != "blocked") {
      let trackDOM = track.current;
      if (!event.touches && typeof event.stopPropagation === "function") {
        event.stopPropagation();
      }
      event = event.touches ? event.touches[0] : event;
      switch (step) {
        case "start":
          startDrag(trackDOM, event);
          break;
        case "on":
          onDrag(trackDOM, event);
          break;
        case "end":
          endDrag(trackDOM, event);
          break;
        default:
          startDrag(trackDOM, event);
          break;
      }
    }
  };

  useEffect(() => {
    console.log(getAspect());
    setCameraAspect(getAspect());
    window.onresize = () => {
      setCameraAspect(getAspect());
    };

    mouseAnimation(camera, isMobile);

    eventBus.on("animCamera", (data) => {
      data(camera.current);
    });

    animateTitle();
  }, []);

  useEffect(() => {
    console.log("Current drag start", dragStart - dragActivity);
  }, [dragActivity]);

  return (
    <>
      <Canvas
        camera={{ position: [0, 2.5, 0] }}
        id="webGlWrapper"
        ref={track}
      >
        <PerspectiveCamera
          ref={camera}
          makeDefault
          manual
          position={!isMobile ? [0, 10, 40] : [0, 0, 25]}
          aspect={cameraAspect}
        />
        <ambientLight color={"0x404040"} intensity={16} />
        <pointLight position={[0, 10, 10]} />
        <BlenderScene isMobile={isMobile} />
        <Html
          className="bi-mobile-nav"
          style={{
            left: 0,
            top: "calc(50vh - 160px)",
            transform: "translate(-50%, -50%)",
          }}
        >
          <nav
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: "24px",
            }}
          >
            <div
              onTouchStart={(event) => {
                eventBus.dispatch("slide-left");
              }}
            >
              <svg
                width="49"
                height="49"
                viewBox="0 0 49 49"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.5"
                  d="M24.5 1C11.5213 1 0.999997 11.5213 0.999998 24.5C0.999999 37.4787 11.5213 48 24.5 48C37.4787 48 48 37.4787 48 24.5C48 11.5213 37.4787 1 24.5 1Z"
                  fill="black"
                  stroke="white"
                  strokeMiterlimit="10"
                />
                <path
                  d="M10.5 24.5257C14.9244 24.5772 18.5772 20.9244 18.5257 16.5L18.5257 16.7058C18.5772 21.0788 22.127 24.5772 26.5 24.5257L26.4486 24.5257C22.0756 24.5772 18.5772 28.127 18.5257 32.4486L18.5257 32.5C18.5257 28.0756 14.9244 24.5257 10.5 24.5257Z"
                  fill="white"
                />
                <path d="M40 24.5L23 24.5" stroke="white" />
              </svg>
            </div>
            <div
              onTouchStart={(event) => {
                eventBus.dispatch("slide-right");
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.5"
                  d="M23.5 47C36.4787 47 47 36.4787 47 23.5C47 10.5213 36.4787 0 23.5 0C10.5213 0 0 10.5213 0 23.5C0 36.4787 10.5213 47 23.5 47Z"
                  fill="black"
                  stroke="white"
                  strokeMiterlimit="10"
                />
                <path
                  d="M37.5 23.4743C33.0756 23.4228 29.4228 27.0756 29.4743 31.5V31.2942C29.4228 26.9212 25.873 23.4228 21.5 23.4743H21.5514C25.9244 23.4228 29.4228 19.873 29.4743 15.5514V15.5C29.4743 19.9244 33.0756 23.4743 37.5 23.4743Z"
                  fill="white"
                />
                <path d="M8 23.5H25" stroke="white" />
              </svg>
            </div>
          </nav>
        </Html>
      </Canvas>
    </>
  );
};

export default Scene;
