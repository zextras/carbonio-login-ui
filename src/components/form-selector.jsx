import V1UserPasswordForm from "./v1/v1-user-password-form";
import React from "react";

export default function FormSelector({configuration}) {
    return <>
        {
            configuration && configuration.version == 1 && <V1UserPasswordForm />
        }
        </>;
}
