import React, { Component, Fragment, createRef } from "react"
import { withRouter } from "react-router"
import { observer, inject } from "mobx-react"
import { observable, computed, runInAction } from "mobx"
import classes from "./GraphView.css"
import { Graph } from "react-d3-graph"

@inject("store")
@observer
class GraphView extends Component {
    @computed
    get documentStore() {
        return this.props.store.document
    }

    componentDidMount() {
        this.documentStore.getDocument(this.props.match.params.documentId)
    }

    render() {
        // graph payload (with minimalist structure)
        const data = {
            nodes: [],
            links: [],
        }

        // the graph configuration, you only need to pass down properties
        // that you want to override, otherwise default ones will be used
        const myConfig = {
            nodeHighlightBehavior: true,
            node: {
                color: "lightgreen",
                size: 200,
                highlightStrokeColor: "blue",
                labelProperty: "label",
            },
            link: {
                highlightColor: "lightblue",
            },
            minZoom: 2,
            maxZoom: 8,
        }

        for (const doc of this.documentStore.documents) {
            console.log(doc)
            const newNode = {
                id: doc.id ? doc.id : doc._id,
                label: doc.name,
            }
            if (
                doc.id ===
                this.documentStore.documents[
                    this.documentStore.documents.length - 1
                ].id
            ) {
                newNode.symbolType = "square"
                newNode.color = "red"
                newNode.size = 400
            } else {
                newNode.symbolType = "circle"
            }
            data.nodes.push(newNode)

            if (doc.dependencies)
                for (const depId of doc.dependencies) {
                    data.links.push({
                        source: doc.id ? doc.id : doc._id,
                        target: depId,
                    })
                }
        }

        console.log(data)
        return (
            <div className={classes.GraphView}>
                {this.documentStore.documents.length > 0 ? (
                    <Graph
                    ref={this.hey}
                        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                        data={data}
                        config={myConfig}
                    />
                ) : <p>Has no dependencies?</p>}
            </div>
        )
    }
}

export default withRouter(GraphView)
