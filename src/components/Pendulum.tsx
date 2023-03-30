import React, { useEffect, useRef } from "react";
import {
  Engine,
  Render,
  World,
  Bodies,
  Body,
  Runner,
  Mouse,
  MouseConstraint,
  Events,
  Constraint,
} from "matter-js";

const PhysicsEngine: React.FC = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const engine = Engine.create();
    const render = Render.create({
      element: containerRef.current ?? undefined,
      engine: engine,
      options: {
        wireframes: false,
        background: "#f0f0f0",
      },
    });

    const ground = Bodies.rectangle(400, 590, 800, 20, {
      isStatic: true,
      render: { fillStyle: "#060a19" },
    });

    // Create a cart
    const cart = Bodies.rectangle(400, 500, 80, 40, {
      render: { fillStyle: "#007bff" },
    });

    // Create a pendulum
    const pendulumAnchor = Bodies.circle(400, 300, 5, {
      isStatic: true,
      render: { fillStyle: "#ff0000" },
    });

    const pendulumBob = Bodies.circle(400, 500, 30, {
      render: { fillStyle: "#28a745" },
    });

    const pendulumConstraint = Constraint.create({
      bodyA: pendulumAnchor,
      bodyB: pendulumBob,
      length: 200,
      stiffness: 1,
    });

    // Connect the cart and pendulum with a constraint
    const cartPendulumConstraint = Constraint.create({
      bodyA: cart,
      pointB: { x: 0, y: -200 },
      bodyB: pendulumAnchor,
      length: 0,
      stiffness: 1,
    });

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    render.mouse = mouse;

    World.add(engine.world, [
      ground,
      cart,
      pendulumAnchor,
      pendulumBob,
      pendulumConstraint,
      cartPendulumConstraint,
      mouseConstraint,
    ]);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world, true);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return (
    <div
      ref={containerRef}      
    />
  );
};

export default function PendulumComponent() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="hidden my-10 text-4xl font-bold tracking-tight text-gray-900 lg:block">
        Pendulum
      </h1>
      <PhysicsEngine />
    </div>
  );
}
