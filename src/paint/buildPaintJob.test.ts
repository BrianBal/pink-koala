import { buildPaintJobs } from "./buildPaintJobs"
import { createNode } from "../render"

describe("buildPaintJobs", () => {
	it("should build layer jobs", () => {
		let node = createNode(
			"root",
			{},
			[
				createNode(
					"fragment",
					{},
					[createNode("layer", { id: "layer-1" }, [], true)],
					true
				),
			],
			true
		)

		let jobs = buildPaintJobs(node)

		expect(jobs.length).toBe(2)
		expect(jobs).toHaveProperty("0.name", "LayerJob")
		expect(jobs).toHaveProperty("0.node.props.id", "layer-1")
		expect(jobs).toHaveProperty("1.name", "LayerEndJob")
		expect(jobs).toHaveProperty("1.node.props.id", "layer-1")
	})

	it("should build rectangle jobs", () => {
		let node = createNode(
			"root",
			{},
			[
				createNode("rectangle", {}, [], true),
				createNode("rect", {}, [], true),
			],
			true
		)

		let jobs = buildPaintJobs(node)

		expect(jobs.length).toBe(2)

		expect(jobs).toHaveProperty("0.name", "RectangleJob")
		expect(jobs).toHaveProperty("0.node.name", "rectangle")

		expect(jobs).toHaveProperty("1.name", "RectangleJob")
		expect(jobs).toHaveProperty("1.node.name", "rect")
	})

	it("should build text jobs", () => {
		let node = createNode(
			"root",
			{},
			[
				createNode("string", {}, [], true),
				createNode("text", {}, [], true),
			],
			true
		)

		let jobs = buildPaintJobs(node)

		expect(jobs.length).toBe(2)

		expect(jobs).toHaveProperty("0.name", "TextJob")
		expect(jobs).toHaveProperty("0.node.name", "string")

		expect(jobs).toHaveProperty("1.name", "TextJob")
		expect(jobs).toHaveProperty("1.node.name", "text")
	})

	it("should build circle jobs", () => {
		let node = createNode(
			"root",
			{},
			[createNode("circle", {}, [], true)],
			true
		)

		let jobs = buildPaintJobs(node)

		expect(jobs.length).toBe(1)

		expect(jobs).toHaveProperty("0.name", "CircleJob")
		expect(jobs).toHaveProperty("0.node.name", "circle")
	})

	it("should build path jobs", () => {
		let node = createNode(
			"root",
			{},
			[createNode("path", {}, [], true)],
			true
		)

		let jobs = buildPaintJobs(node)

		expect(jobs.length).toBe(1)

		expect(jobs).toHaveProperty("0.name", "PathJob")
		expect(jobs).toHaveProperty("0.node.name", "path")
	})

	it("should build polygon jobs", () => {
		let node = createNode(
			"root",
			{},
			[createNode("polygon", {}, [], true)],
			true
		)

		let jobs = buildPaintJobs(node)

		expect(jobs.length).toBe(1)

		expect(jobs).toHaveProperty("0.name", "PolygonJob")
		expect(jobs).toHaveProperty("0.node.name", "polygon")
	})

	it("should build frame jobs", () => {
		let node = createNode(
			"root",
			{},
			[createNode("frame", {}, [], true)],
			true
		)

		let jobs = buildPaintJobs(node)

		expect(jobs.length).toBe(2)

		expect(jobs).toHaveProperty("0.name", "FrameJob")
		expect(jobs).toHaveProperty("0.node.name", "frame")

		expect(jobs).toHaveProperty("1.name", "FrameEndJob")
		expect(jobs).toHaveProperty("1.node.name", "frame")
	})

	it("should build group jobs", () => {
		let node = createNode(
			"root",
			{},
			[createNode("group", {}, [], true)],
			true
		)

		let jobs = buildPaintJobs(node)

		expect(jobs.length).toBe(2)

		expect(jobs).toHaveProperty("0.name", "GroupJob")
		expect(jobs).toHaveProperty("0.node.name", "group")

		expect(jobs).toHaveProperty("1.name", "GroupEndJob")
		expect(jobs).toHaveProperty("1.node.name", "group")
	})

	it("should skip nodes that don't need draw", () => {
		let node = createNode(
			"root",
			{},
			[
				createNode("group", {}, [], true),
				createNode("rectangle", {}, [], false),
			],
			true
		)

		let jobs = buildPaintJobs(node)

		expect(jobs.length).toBe(2)

		expect(jobs).toHaveProperty("0.name", "GroupJob")
		expect(jobs).toHaveProperty("0.node.name", "group")

		expect(jobs).toHaveProperty("1.name", "GroupEndJob")
		expect(jobs).toHaveProperty("1.node.name", "group")
	})
})
