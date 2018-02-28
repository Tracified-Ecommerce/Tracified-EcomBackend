interface IComponentJSON {
    htmltxt: string;
    pieChartData: any[];
}

// dimension component
interface IDimensionJSON {
    htmltxt: string;
}

// mapTab component
interface IMapTab {
    markers: any[];
    mapID: string;
}
// image slider component
interface IImageSliderJSON {
    htmltxt: string;
}

// map component
interface IMapJSON {
    htmltabs: string;
    htmltabcontent: string;
    mapTabData: any[];
}

interface IResponseJSON {
    components: IComponentJSON;
    mapComponents: IMapJSON;
    dimensionComponents: IDimensionJSON;
    imageSliderComponents: IImageSliderJSON;
}

function componentBuilder(components: any): IComponentJSON {

    const componentJSON: IComponentJSON = {
        htmltxt: "",
        pieChartData: [],
    };

    for (const component of components) {
        componentJSON.htmltxt += "<div class=\"col-md-4 col-sm-6 col-xs-12\">";
        let tot: number = 0;
        switch (component.uiComponent.name) {

            case "pieChart":
                for (const value of component.values) {
                    if (value === true) {
                        tot++;
                    }
                }

                const arcData = {
                    bigArc: tot,
                    littleArc: component.values.length - tot,
                };

                const pieOptions = {
                    canvas: component.key,
                    colors: ["#2f823a", "#5bfd72"],
                    data: arcData,
                    doughnutHoleSize: 0.5,
                    percentage: Math.floor((tot / component.values.length) * 100).toString(),
                };

                componentJSON.pieChartData.push(pieOptions);
                componentJSON.htmltxt += "<canvas id=\"" + component.key + "\"" + "></canvas>";
                componentJSON.htmltxt += "<div class=\"titleDiv\">" + component.uiComponent.title + "</div>" +
                    "<div class=\"subtitleDiv\">" + component.uiComponent.subTitle + "</div></div>";
                break;

            case "xOutOfY":
                if (component.uiComponent.titleFunction) {
                    if (component.uiComponent.titleFunction === "getMode") {
                        const valMap: any = {};
                        let maxElement = "";
                        let maxCount = 0;
                        for (const value of component.values) {
                            if (!valMap.hasOwnProperty(value)) {
                                valMap[value] = 0;
                            } else {
                                valMap[value] = valMap[value] + 1;
                                if (valMap[value] > maxCount) {
                                    maxCount = valMap[value];
                                    maxElement = value;
                                }
                            }
                        }
                        componentJSON.htmltxt +=
                            "<div class=\"green\"><span class=\"large-green\">" + maxCount +
                            "</span>" + component.values.length + "</div>" +
                            "<div class=\"titleDiv\">" + maxElement + "</div>" +
                            "<div class=\"subtitleDiv\">" + component.uiComponent.subTitle + "</div></div>";
                    }
                } else {
                    for (const value of component.values) {
                        if (value === true) {
                            tot++;
                        }
                    }
                    componentJSON.htmltxt +=
                        // tslint:disable-next-line:max-line-length
                        "<div class=\"xoutofy-top\">" + tot + "</div><div class=\"xoutofy-middle\">out of " + component.values.length + " items</div>"
                        + "<div class=\"titleDiv\"><span class=\"titleModifier\">" + "have " + "</span>" +
                        component.uiComponent.title +
                        "</div><div class=\"subtitleDiv\">" + component.uiComponent.subTitle + "</div></div>";
                }
                break;

            case "outOfTen":
                if (component.uiComponent.titleFunction) {
                    if (component.uiComponent.titleFunction === "getMode") {
                        const valMap: any = {};
                        let maxElement = "";
                        let maxCount = 0;
                        for (const value of component.values) {
                            if (!valMap.hasOwnProperty(value)) {
                                valMap[value] = 0;
                            } else {
                                valMap[value] = valMap[value] + 1;
                                if (valMap[value] > maxCount) {
                                    maxCount = valMap[value];
                                    maxElement = value;
                                }
                            }
                        }
                        componentJSON.htmltxt +=
                            "<div class=\"large-green\">" + maxCount + "/" + component.values.length + "</div>" +
                            "<div class=\"titleDiv\">have " + maxElement + "</div>" +
                            "<div class=\"subtitleDiv\"> as the " + component.uiComponent.subTitle + "</div></div>";
                    }
                } else {
                    for (const value of component.values) {
                        if (value === true) {
                            tot++;
                        }
                    }
                    componentJSON.htmltxt +=
                        "<div class=\"large-green\">" + tot + "/" + component.values.length + "</div>"
                        + "<div class=\"titleDiv\">" +
                        component.uiComponent.title +
                        "</div><div class=\"subtitleDiv\">" + component.uiComponent.subTitle + "</div></div>";
                }
                break;

            case "barChart":
                for (const value of component.values) {
                    if (value === true) {
                        tot++;
                    }
                }
                componentJSON.htmltxt += "<div class=\"large-green\">bar " + tot + "</div>"
                    + "<div class=\"titleDiv\">" + component.uiComponent.title +
                    "</div><div class=\"subtitleDiv\">" + component.uiComponent.subTitle + "</div></div>";
                break;

            default:
                console.log("default");
                break;

        }
    }

    return componentJSON;
}

// dimension builder function
function dimensionBuilder(dimensions: any): IDimensionJSON {
    const dimensionComponents: IDimensionJSON = {
        htmltxt: "",
    };

    for (const dimension of dimensions) {
        // tslint:disable-next-line:max-line-length
        dimensionComponents.htmltxt += "<div class=\"col-md-6\" id=\"dimensionName\"><table class=\"tblDimensions\"><tr><td class=\"dimTitle\" style=\"background-color:" + dimension.titleBackColor + ";color:" + dimension.titleTxtColor + "\">" + dimension.name + "";
        // tslint:disable-next-line:max-line-length
        dimensionComponents.htmltxt += "</td><td class=\"descript\" style=\"background-color:" + dimension.descriptionBackColor + ";color:" + dimension.descriptionTxtColor + "\">" + dimension.tagline + "</td></tr>";

        for (const x of dimension.data) {
            // tslint:disable-next-line:max-line-length
            dimensionComponents.htmltxt += "<tr class=\"dimensionContent\"><td class=\"keyTitle\">" + x.label + "</td><td class=\"keyContent\">" + x.value + "</td></tr>";
        }
        dimensionComponents.htmltxt += "</table></div>";
    }

    return dimensionComponents;

}

// image slider builder function
function imageSliderBuilder(images: any): IImageSliderJSON {
    const imageSliderComponents: IImageSliderJSON = {
        htmltxt: "",
    };

    // tslint:disable-next-line:max-line-length 

    let imageIdentifier = 0; // to keep track of images we have already looked at
    let rowCount = 0; // to keep track of image rows

    while (rowCount < 2) {
        // row code

        for (let i = 0; i < 3; i++) {

            //code for columns inside row
            if (rowCount === 0) {
                imageSliderComponents.htmltxt += "<div class=\"item active\"><div class=\"row\">"
            }
            else {
                imageSliderComponents.htmltxt += "<div class=\"item\"><div class=\"row\">"
            }

            // tslint:disable-next-line:max-line-length
            imageSliderComponents.htmltxt += "<div class=\"col-md-4\"><img id=\"img" + imageIdentifier + "\" width=\"100\" height=\"200\" align=\"middle\" hspace=\"30\"><div class=\"carousel-caption\"></div></div></div></div>";
            // images[imageIdentifier]
            imageIdentifier++;
        }

        rowCount++;
    }



    return imageSliderComponents;

}

function mapBuilder(tabs: any): IMapJSON {
    const mapComponents: IMapJSON = {
        htmltabcontent: "",
        htmltabs: "",
        mapTabData: [],
    };

    let count: number = 0;

    for (const tab of tabs) {

        // tslint:disable-next-line:max-line-length
        mapComponents.htmltabs += "<button id =\"button" + count + "\" class=\"tablinks\" onclick=\"openCity(event, 'tab" + count + "')\">" + tab.tabName + "</button>";
        mapComponents.htmltabcontent += "<div id =\"tab" + count + "\" class =\"tabcontent\">";
        // tslint:disable-next-line:max-line-length
        mapComponents.htmltabcontent += "<div id =\"map" + count + "\" style=\"height: 440px; border: 1px solid #AAA;\"></div></div>";
        const mapTab: IMapTab = {
            mapID: "map" + count,
            markers: [],
        };

        for (const coordinate of tab.values) {


            const mapData = {
                // label: coordinate.label,
                lat: parseFloat(coordinate.lat),
                long: parseFloat(coordinate.long),
            };
            mapTab.markers.push(mapData);

        }

        mapComponents.mapTabData.push(mapTab);
        count++;

    }

    return mapComponents;
}

export { componentBuilder, IComponentJSON, IResponseJSON, IDimensionJSON, dimensionBuilder, mapBuilder, IMapJSON, imageSliderBuilder, IImageSliderJSON };
