# dn_slide

This bundle lets the user slice through 3D layers.

## Usage
Add the bundle "dn_slice" to your map.apps 4 app and add the sliceToggleTool to a toolset.
Additionally, you need to configure either a 3D-portal item or a 3D SceneLayer through which the user should be able to slice.

To make the functions of this bundle available to the user, the following tool can be added to a toolset:

| Tool ID         | Component       | Description                    |
| --------------- | --------------- | ------------------------------ |
| sliceToggleTool | sliceToggleTool | Show or hide the slice widget. |

## Restrictions
This bundle only works with SceneView. Also, visualizations created using slices are temporary and cannot be persisted in a WebScene or in slides.
