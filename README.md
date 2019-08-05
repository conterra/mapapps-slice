# Slice
This bundle lets the user slice through 3D layers.It integrates the Esri slice Widget into mapapps,
![Screenshot App](https://github.com/conterra/mapapps-slice/blob/master/screenshot.PNG)

## Sample App
https://demos.conterra.de/mapapps/resources/apps/downloads_slice/index.html

## Installation Guide
**Requirement: map.apps 4.7.0**
**Restrictions: Only works in 3D view**

Add the bundle "dn_slice" to your map.apps 4 app and add the sliceTool to a toolset.

Additionally, you need to configure either a 3D-portal item or a 3D SceneLayer through which the user should be able to slice.

#### Restrictions
This bundle only works with SceneView. Addtionally, are visualizations created using slices temporary and cannot be persisted in a WebScene or in slides.
## Development Guide
### Define the mapapps remote base
Before you can run the project you have to define the mapapps.remote.base property in the pom.xml-file:
`<mapapps.remote.base>http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%</mapapps.remote.base>`

### Other methods to to define the mapapps.remote.base property.
1. Goal parameters
`mvn install -Dmapapps.remote.base=http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%`

2. Build properties
Change the mapapps.remote.base in the build.properties file and run:
`mvn install -Denv=dev -Dlocal.configfile=%ABSOLUTEPATHTOPROJECTROOT%/build.properties`
