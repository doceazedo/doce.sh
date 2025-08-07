---
title: "Twin-stick movement and directional animations in 3D with vector math"
date: "2025/08/05"
icon: "/img/icons/rust.svg"
blueskyPostId: "3lvofibnhvc2y"
mastodonPostId: "114977702291659030"
---

<video src="/video/blog/twin-stick-animations/demo.mp4" muted autoplay loop playsinline></video>

Top-down or _isometric_ ARPG games such as Path of Exile 2 or Last Epoch allows the player to control the character with WASD for moving around and the cursor for aiming.

In games like POSTAL or The Ascent, for example, you use one controller stick for moving and the other for aiming and shooting, which defines the "twin-stick shooter" mechanic.

This mechanic introduces a new challenge for game developers: **how do we animate the legs moving in one direction, while the upper body looks to another?**

For a 2D game, we could have separate sprites for the lower and upper body. In 3D, we could have the upper body look at one direction while the lower body rotates torwards the movement direction, but that would be completely unrealistic. That's because human hips are famously known for not being able to rotate 360°.

## Mise en place

If you're planning to follow along, I expect you to already have a top-down character controller in place. Nothing fancy, any rigid body that can move with WASD and rotate torwards the cursor position should be enough.

You will also need a character model with 8 directional movement animations (forwards, backwards, left, right, and diagonals). You could technically do it with only 4 directions, but it wouldn't look very good.

For this project, I used Quaternius's CC-0 [Universal Animation Library](https://quaternius.com/packs/universalanimationlibrary.html). The directional jog animations I used are only available on the Pro version, tho. This is not sponsored/affiliated, but it's 100% worth it. Quaternius does a **LOT** of great free assets.

I'm also using the [Bevy Engine](https://bevy.org) for my project, but you can easily translate any of these concepts from Rust to any other language or game engine, as the solution mostly revolves around algebra and handling vectors.

## What are we trying to solve?

First of all, let's assess the problem and what we want to achieve:

- If the player walks to the **right** with the cursor also to the **right**, the character animation should simply walk **forward**.
- If the player walks to the **left** with the cursor pointing to the **right**, the character animation should walk **backwards** instead.
- If the player walks straight **down** with the cursor to the **left**, the character animation should walk **sideways**.

So what we need to find out is **in what direction the player is moving in relation to the direction they are looking**. That will give us the direction their legs should be walking torwards, no matter what the character is looking at.

## Figuring out directions

To find out which direction animation we should use, we will need the movement and looking directions.

I already know the movement direction from handling the WASD inputs:

```rust
let axis = player_input.clamped_axis_pair(&MovementAction::Walk).normalize_or_zero();
let move_direction = Vec3::new(axis.x, 0., -axis.y);
```

And I also know where the player is looking by getting the direction from their position to the cursor's world position:

```rust
let look_direction = (cursor_world_position.0 - position.0).normalize_or_zero();
```

> 💡 Normalizing a final `Vec3` position minus a initial `Vec3` position will return a direction vector to that final position.

This only accounts for players using a mouse and keyboard. For handling controllers we could use the axes from each stick instead.

Now, to find out if the character animation should walk backwards or forwards, we can calculate the `dot` product between `look_direction` and `move_direction`, which will return a positive value if they both point in the same direction or a negative value if they point in opposite directions. This way, we can check if the player is walking on the same direction they are looking and return that direction:

```rust
let walking_bwd_or_fwd = look_direction.dot(move_direction);
```

Great! Right now we could already set the correct forward and backward animations, but we also want to know if the animation should walk to the left or to the right.

If we had the direction to the side of the player, we could use that to calculate the `dot` product between the `move_direction` and the side to find out if we are walking to the left or to the right. Fortunately for us, the `cross` product of two 3D vectors results in a third vector which is perpendicular to them.

If you notice this diagram from the [Unity documentation](https://docs.unity3d.com/ScriptReference/Vector3.Cross.html), you'll see that the `cross` product of the forward vector **a** (the middle finger) and the upward vector **b** (the index finger) results on the right vector (the thumb):

<center>
  <img src="/img/blog/twin-stick-animations/left-hand-rule-diagram.webp" />
</center>

Now that we can calculate the `right_direction` of the character, we can also use it to calculate the `dot` product between `move_direction` and `right_direction` to find out if the animation should walk to the left or to the right:

```rust
let right_direction = look_direction.cross(Vec3::Y);
let walking_left_or_right = move_direction.dot(right_direction);
```

Perfect! Now we have everything that we need to set the proper walk animations.

## Mapping directions to animations

If you are working with Godot, you probably want to use [BlendSpace2D](https://docs.godotengine.org/en/stable/classes/class_animationnodeblendspace2d.html) where one axis goes from backwards to forwards, and the other from left to right. This way you can plot each of the 8 animations on the graph and pass the values we calculated so that Godot blends the animations for you.

The blend between some of those animations looks quite bad, tho. And since we only have 8 animations to work with, what I ended up doing is _snapping_ the movement direction to the nearest animation. So if you're walking on a 100° angle, it will round to 90° and use that animation instead.

It's much harder to notice that the character's lower body direction is 20° off than it is to notice that the character is unexpectedly hopping or sliding.

We can use `atan2` to calculate the angle between `walking_bwd_or_fwd` and `walking_left_or_right`. Then, we can round this angle (in degrees) to the nearest multiple of 45 (360 degrees ÷ 8 direction animations):

```rust
const ARC: f32 = 45.;
let movement_angle = atan2(walking_left_or_right, walking_bwd_or_fwd);
let snapped_angle_deg = ((feet_direction.to_degrees() / ARC).round() * ARC) as i32;
```

Finally, with that value we can infer the proper animation, similarly to a compass:

```rust
let walk_animation = match snapped_angle_deg {
  0    => Animations::WalkN,  // forwards
  45   => Animations::WalkNE, // forwards right
  90   => Animations::WalkE,  // right
  135  => Animations::WalkSE, // backwards right
  180  => Animations::WalkS,  // backwards
  -180 => Animations::WalkS,  // backwards
  -135 => Animations::WalkSW, // backwards left
  -90  => Animations::WalkW,  // left
  -45  => Animations::WalkNW, // forwards left
  _    => Animations::WalkN,  // forwards
};
```

## Final results

In the end, this is how the character controller is looking so far:

<video src="/video/blog/twin-stick-animations/final-results.mp4" muted autoplay loop playsinline></video>

I'm very happy with the results, it looks quite clean! In the future I'll also implement animation masks for having different animations for the upper and lower body (for example, swinging a sword while walking).

Please make sure to let me know if you found this one helpful or interesting on Bluesky or Mastodon! :) I would also love to know what you would have done differently.
