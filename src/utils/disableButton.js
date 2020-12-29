import { DESIGNATION } from '../config'


export const disableSubmit = (loggedUser, staticModule, staticComponent) => {
  if (loggedUser.designation &&
    (loggedUser.designation.designationName === DESIGNATION[2] ||
      loggedUser.designation.designationName === DESIGNATION[1])) {
    return false
  } else {
    if (loggedUser && loggedUser.webModule) {
      const webModule = loggedUser.webModule.filter(module => module.moduleName === staticModule)[0]
      console.log("disableSubmit -> webModule", webModule)
      const component = webModule && webModule.component.filter(comp => comp.componentPath === staticComponent)[0]
      console.log("disableSubmit -> component", component)
      if (component && (component.write)) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }

}