import {shallow} from 'enzyme';
import React from "react";
import V1CredentialsForm from "./v1-credentials-form";

jest.mock('@zextras/zapp-ui');

import {Input} from "../../../zapp-ui/src";


it("renders without crashing", () => {
    const form = shallow(<V1CredentialsForm />);

    expect(form.contains('')).toEqual(false);
});