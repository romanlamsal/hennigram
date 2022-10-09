#!/usr/bin/env node
import "source-map-support/register"
import * as cdk from "aws-cdk-lib"
import { ApiStack } from "../lib/stacks/ApiStack"
import { Globals } from "../lib/stacks/Globals"
import { AppStack } from "../lib/stacks/AppStack"
import { CDNStack } from "../lib/stacks/CDNStack"

const app = new cdk.App()

export const globals = new Globals(app)
export const apiStack = new ApiStack(app)

new CDNStack(app)
new AppStack(app)
