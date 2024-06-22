import { transitAPISecondRegionURL, transitApiFirstRegionUrl } from "../config/constants";

function chooseRegion(regionId: string) {
    return regionId === 'Ha-Noi' ? transitApiFirstRegionUrl : transitAPISecondRegionURL
}

export default chooseRegion;