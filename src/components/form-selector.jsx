import V1Login from "./v1/v1-login";
import React from "react";

export default function FormSelector({configuration, hideSamlButton}) {
    return <>
        {
            configuration && (configuration.version == 1 || configuration.version == null) && <V1Login disabled={configuration.disableInputs} hideSamlButton={hideSamlButton} />
        }
        </>;
}
