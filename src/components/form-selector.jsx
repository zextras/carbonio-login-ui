import V1Login from "./v1-login";
import React from "react";

export default function FormSelector({configuration, hideSamlButton}) {
    return <>
        {
            configuration && (configuration.maxApiVersion === 1 || configuration.disableInputs === true) && <V1Login configuration={configuration} hideSamlButton={hideSamlButton} />
        }
        </>;
}
