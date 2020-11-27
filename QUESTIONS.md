# Questions

## How long did this assignment take you and where did you spend your time?

Aside from learning the new tools I wanted to use for this project, this assignment took around 6 hours. This was due in part to the new tools that I used as well as creating and playing around with a custom WebGL component.

## What would you do differently or improve in your submission?

There are quite a few things I would like to do to improve my submission:
- First and foremost; more unit and e2e tests. I would like to, at the very least, have 100% unit test coverage on the web server's end point as well as the front-end's state management system (Redux.)
- The ability to update and delete cards not just get and post.
- More elegant error handling with different status codes on the frontend and backend. This should be relatively easy (thanks to the tools being used - NestJS and Redux) but I couldn't justify spending more time on this at the moment.
- I could abstract Canvas element further to accept shaders, uniforms, and attributes as props to component - instead of being tightly-coupled with the DimCircle component.
- Finally, I'd like to integrate the WebGL component with the user's input - the colorful circle component (named DimCircle) takes a set of uniforms that can be manipulated at runtime using requestAnimationFrame. I would like to use the state of the textarea to manipulate the color and animation of the component. I think this would add a really unique (albeit most likely over the top) UX to the app.

## Conclusion

Overall I really enjoyed working on this project and used this as an excuse to learn a couple new powerful tools:
- NestJS - powerful and feature-rich statically typed web server framework.
- WebGL (without an auxillary library like ThreeJS) - graphics library for the web similar to OpenGL, can render extremely unique and beautiful 3D animations.