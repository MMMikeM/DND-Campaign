import type { Edge, Node } from "@xyflow/react"
import { Position, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react"
import type React from "react"
import { useCallback, useEffect } from "react"
import "@xyflow/react/dist/style.css"
import Dagre from "@dagrejs/dagre"
import type { RawQuestStage, StageDecision } from "../lib/entities"

// Define types for the component props
interface QuestStageFlowProps {
	stages: RawQuestStage[]
	currentStageId: number | null
	onStageSelect: (stageId: number) => void
}

// Component to display quest stage flow
const QuestStageFlow = ({ stages, currentStageId, onStageSelect }: QuestStageFlowProps) => {
	// Transform stages data to React Flow format

	const transformToReactFlow = useCallback(() => {
		const nodes: Node[] = []
		const edges: Edge[] = []
		const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))

		// Configure the graph direction for horizontal layout
		g.setGraph({
			rankdir: "LR", // Left to right layout
			nodesep: 20, // Vertical spacing between nodes
			ranksep: 180, // Horizontal spacing between stages
			marginx: 20,
			marginy: 20,
		})

		// Create maps for parent-child relationships
		const childToParentMap = new Map<number, { parentId: number; decision: StageDecision }>()
		const parentToChildrenMap = new Map<number, Array<{ childId: number; decision: StageDecision }>>()

		// Build relationship maps
		stages.forEach((stage: RawQuestStage) => {
			// Initialize empty children array for this stage
			if (!parentToChildrenMap.has(stage.id)) {
				parentToChildrenMap.set(stage.id, [])
			}

			// Process outgoing decisions
			stage.outgoingDecisions?.forEach((decision: StageDecision) => {
				if (decision.toStageId) {
					// Add child to parent's children list
					parentToChildrenMap.get(stage.id)?.push({
						childId: decision.toStageId,
						decision,
					})

					// Add parent reference to child
					childToParentMap.set(decision.toStageId, {
						parentId: stage.id,
						decision,
					})
				}
			})
		})

		// Find root node (has no parent)
		const rootStage = stages.find((stage: RawQuestStage) => !childToParentMap.has(stage.id))
		if (!rootStage) return { nodes, edges }

		// Generate hierarchical numbers
		const hierarchicalNumbers = new Map<number, string>()

		// Recursive function to assign numbers like 1, 1.1, 1.2, 1.1.1, etc.
		const assignNumbersRecursive = (stageId: number, prefix: string) => {
			hierarchicalNumbers.set(stageId, prefix)

			// Get all children
			const children = parentToChildrenMap.get(stageId) || []

			// Assign numbers to children
			children.forEach((child, index) => {
				const childNumber = `${prefix}.${index + 1}`
				assignNumbersRecursive(child.childId, childNumber)
			})
		}

		// Start numbering from root
		assignNumbersRecursive(rootStage.id, "1")

		// Find path from current node to root for animation
		const animatedEdges = new Set<string>()

		if (currentStageId) {
			let currentId = currentStageId

			// Trace path back to root
			while (childToParentMap.has(currentId)) {
				const { parentId } = childToParentMap.get(currentId)!
				animatedEdges.add(`edge-stage-${parentId}-stage-${currentId}`)
				currentId = parentId
			}
		}

		// Create nodes with hierarchical numbers
		stages.forEach((stage: RawQuestStage) => {
			const stageId = `stage-${stage.id}`
			const hierarchicalNumber = hierarchicalNumbers.get(stage.id) || ""

			nodes.push({
				id: stageId,
				position: { x: 0, y: 0 }, // Will be set by Dagre
				data: {
					label: (
						<div>
							<div>
								<strong>
									{hierarchicalNumber}: {stage.name}
								</strong>
							</div>
							{stage.location && <div>Location: {stage.location.name}</div>}
							{stage.clues?.length > 0 && <div>Clues: {stage.clues.length}</div>}
						</div>
					),
				},
				style: {
					background: stage.id === currentStageId ? "#e6f7ff" : "#ffffff",
					border: stage.id === currentStageId ? "2px solid #1890ff" : "1px solid #d9d9d9",
					padding: 10,
					borderRadius: 5,
					width: 180,
				},
				sourcePosition: Position.Right,
				targetPosition: Position.Left,
			})

			g.setNode(stageId, { width: 180, height: 110 })
		})

		// Create edges with animation on path to root
		stages.forEach((stage: RawQuestStage) => {
			const sourceId = `stage-${stage.id}`

			stage.outgoingDecisions?.forEach((decision: StageDecision) => {
				if (decision.toStageId) {
					const targetId = `stage-${decision.toStageId}`
					const edgeId = `edge-${sourceId}-${targetId}`

					// Add edge to Dagre graph
					g.setEdge(sourceId, targetId)

					// Check if this edge is on the path to root
					const isOnPath = animatedEdges.has(edgeId)

					edges.push({
						id: edgeId,
						source: sourceId,
						target: targetId,
						animated: isOnPath,
						style: {
							stroke: isOnPath ? "#1890ff" : "#555",
							strokeWidth: isOnPath ? 2 : 1,
						},
						label: decision.name,
					})
				}
			})
		})

		// Run the layout algorithm
		Dagre.layout(g)

		// Apply the calculated positions to the React Flow nodes
		nodes.forEach((node) => {
			const nodeWithPosition = g.node(node.id)

			// Center the node based on its dimensions
			node.position = {
				x: nodeWithPosition.x - nodeWithPosition.width / 2,
				y: nodeWithPosition.y - nodeWithPosition.height / 2,
			}
		})

		return { nodes, edges }
	}, [stages, currentStageId])

	// Initialize flow data
	const { nodes: initialNodes, edges: initialEdges } = transformToReactFlow()
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

	const onNodeClick = useCallback(
		(_: React.MouseEvent, node: Node) => {
			// Extract the stage ID from the node ID (remove "stage-" prefix)
			const stageId = parseInt(node.id.replace("stage-", ""), 10)

			// Call the parent component's callback with the selected stage ID
			if (onStageSelect && !Number.isNaN(stageId)) {
				onStageSelect(stageId)
			}
		},
		[onStageSelect],
	)

	// Update when stages or currentStageId changes
	useEffect(() => {
		const { nodes: newNodes, edges: newEdges } = transformToReactFlow()
		setNodes(newNodes)
		setEdges(newEdges)
	}, [setNodes, setEdges, transformToReactFlow])

	return (
		<div style={{ width: "100%", height: "40vh" }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onNodeClick={onNodeClick}
				fitView
				fitViewOptions={{ padding: 0.1 }}
				zoomOnScroll={false}
				zoomOnPinch={false}
				zoomOnDoubleClick={false}
				panOnScroll={false}
				panOnDrag={false}
				nodesDraggable={false}
				nodesConnectable={false}
				elementsSelectable={false}
			/>
		</div>
	)
}

export default QuestStageFlow
