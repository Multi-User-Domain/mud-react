import {HTMLAttributes, useState} from "react";

import {
    Thing,
    SolidDataset
} from "@inrupt/solid-client";

import {
    Table,
    TableColumn,
} from "@inrupt/solid-ui-react";

import {
  Box,
  Button
} from "@material-ui/core";

import { RDF, VCARD, FOAF } from "@inrupt/lit-generated-vocab-common";
import { MUD } from "../../../lib/MUD";

import styles from "./buildingTable.module.css";

export default function BuildingTable(
    {settlement, goBack} : {settlement: Thing, goBack: () => void}): React.ReactElement {

    return (
    <>
        <Box>
            <Button onClick={goBack}>
                Go Back
            </Button>
        </Box>
        <Box>
            <h2>Selected a Settlement</h2>
        </Box>
    </>
    );
}