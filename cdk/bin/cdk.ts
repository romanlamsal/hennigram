#!/usr/bin/env node
import "source-map-support/register"
import * as cdk from "aws-cdk-lib"
import { ApiStack } from "../lib/stacks/ApiStack"
import { Globals } from "../lib/stacks/Globals"
import { CDNStack } from "../lib/stacks/CDNStack"

const app = new cdk.App()

export const apiStack = new ApiStack(app)
export const globals = new Globals(app)

new CDNStack(app)
