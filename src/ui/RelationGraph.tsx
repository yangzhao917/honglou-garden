import { useMemo, useState } from "react";
import Portrait from "./Portrait";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  MarkerType,
  type NodeProps,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { Person, Relation, RelationKind } from "../domain/models";

const kindColor: Record<RelationKind, string> = {
  family: "#8a7a5c",
  servant: "#7d94a8",
  social: "#83976e",
  sentiment: "#a24e3a",
};
const kindName: Record<RelationKind, string> = {
  family: "亲属",
  servant: "主仆",
  social: "交往",
  sentiment: "情缘",
};
const kinds = Object.keys(kindName) as RelationKind[];

type PersonNodeData = {
  person: Person;
  label: string;
  center: boolean;
  dim: boolean;
  color: string;
};
type PersonNodeType = Node<PersonNodeData, "person">;

function PersonNode({ data, selected }: NodeProps<PersonNodeType>) {
  const s = data.center ? 66 : data.dim ? 44 : 54;
  return (
    <div className={`rf-node ${data.center ? "center" : ""} ${data.dim ? "dim" : ""} ${selected ? "selected" : ""}`}>
      <div
        className={`rf-person ${data.center ? "center" : ""} ${data.dim ? "dim" : ""} ${selected ? "selected" : ""}`}
        style={{ "--pcolor": data.color } as React.CSSProperties}
      >
        <Handle type="target" position={Position.Left} className="rf-handle" />
        <Portrait person={data.person} size={s} />
        <Handle type="source" position={Position.Right} className="rf-handle" />
      </div>
      <span className="rf-person-name">{data.label}</span>
    </div>
  );
}

const nodeTypes = { person: PersonNode };
const short = (name: string) => name.replace(/^贾/, "");

/**
 * 交互式人物关系图谱（React Flow）：中心为被选人物，内圈为直接关联者（一跳），
 * 外圈为弱化的二跳节点。支持点击切换人物、缩放/平移/适配视图、按关系类型过滤；
 * 边上始终带关系文字，不单靠颜色（颜色仅作辅助）。
 */
export default function RelationGraph({
  person,
  edges,
  relations,
  people,
  onFocus,
  onFullscreen,
}: {
  person: Person;
  edges: { relation: Relation; other?: Person }[];
  relations: Relation[];
  people: Person[];
  onFocus?: (id: string) => void;
  onFullscreen?: () => void;
}) {
  const [on, setOn] = useState<Record<RelationKind, boolean>>({
    family: true,
    servant: true,
    social: true,
    sentiment: true,
  });

  const { nodes, nodeEdges, satEdges } = useMemo(() => {
    type Placed = {
      n: Node<PersonNodeData, "person">;
      kind: RelationKind;
      label: string;
      angle: number;
      chapter?: number;
    };
    const firstRel = edges.filter((e) => e.other && on[e.relation.kind]);
    // 去重：同一人物用一条边，关系文字合并
    const byPerson = new Map<string, { relation: Relation; other: Person }>();
    for (const e of firstRel) {
      const p = e.other!;
      const prev = byPerson.get(p.id);
      if (prev) {
        prev.relation = {
          ...prev.relation,
          label: `${prev.relation.label} · ${e.relation.label}`,
        };
      } else byPerson.set(p.id, { relation: e.relation, other: p });
    }
    const firstPlaced: Placed[] = [...byPerson.values()].map((e, i) => {
      const angle =
        -Math.PI / 2 +
        (i / Math.max(byPerson.size, 1)) * Math.PI * 2;
      return {
        n: {
          id: e.other.id,
          type: "person",
          position: { x: Math.cos(angle) * 230, y: Math.sin(angle) * 230 },
          data: {
            person: e.other,
            label: short(e.other.name),
            center: false,
            dim: false,
            color: kindColor[e.relation.kind],
          },
        },
        kind: e.relation.kind,
        label: e.relation.label,
        angle,
        chapter: e.relation.chapter,
      };
    });

    const inFirst = new Set(firstPlaced.map((f) => f.n.data.person.id));
    const satByParent = new Map<string, { person: Person; relation: Relation; angle: number; n: Node<PersonNodeData, "person"> }[]>();
    for (const f of firstPlaced) {
      const parentId = f.n.data.person.id;
      for (const r of relations) {
        if (r.from !== parentId && r.to !== parentId) continue;
        const oid = r.from === parentId ? r.to : r.from;
        if (oid === person.id || inFirst.has(oid)) continue;
        if (!on[r.kind]) continue;
        const op = people.find((p) => p.id === oid);
        if (!op) continue;
        let arr = satByParent.get(parentId) ?? [];
        if (arr.some((s) => s.person.id === oid)) continue;
        const spread = (arr.length + 1) * 0.52 - 0.6;
        const a = f.angle + spread;
        arr.push({
          person: op,
          relation: r,
          angle: a,
          n: {
            id: `sat-${parentId}-${oid}`,
            type: "person",
            position: { x: Math.cos(a) * 360, y: Math.sin(a) * 360 },
            data: {
              person: op,
              label: short(op.name),
              center: false,
              dim: true,
              color: kindColor[r.kind],
            },
          },
        });
        satByParent.set(parentId, arr);
      }
    }

    const centerNode: Node<PersonNodeData, "person"> = {
      id: person.id,
      type: "person",
      position: { x: 0, y: 0 },
      data: {
        person,
        label: short(person.name),
        center: true,
        dim: false,
        color: person.accent,
      },
    };

    const nodeEdges: Edge[] = firstPlaced.map((f) => ({
      id: `e-${person.id}-${f.n.id}`,
      source: person.id,
      target: f.n.id,
      type: "straight",
      label: f.label,
      animated: f.kind === "sentiment",
      labelStyle: { fill: "#5f6a58", fontSize: 10, fontFamily: "serif" },
      labelBgStyle: { fill: "#f7f5ec", fillOpacity: 0.92 },
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 2,
      style: { stroke: kindColor[f.kind], strokeWidth: 1.6 },
      markerEnd: { type: MarkerType.ArrowClosed, color: kindColor[f.kind], width: 9, height: 9 },
    }));

    const satEdges: Edge[] = [];
    satByParent.forEach((arr, parentId) =>
      arr.forEach((s) =>
        satEdges.push({
          id: `se-${parentId}-${s.n.id}`,
          source: parentId,
          target: s.n.id,
          type: "straight",
          style: { stroke: "#b8bda9", strokeWidth: 0.9, strokeDasharray: "2 4" },
        }),
      ),
    );

    return {
      nodes: [centerNode, ...firstPlaced.map((f) => f.n), ...[...satByParent.values()].flatMap((a) => a.map((s) => s.n))],
      nodeEdges,
      satEdges,
    };
  }, [person, edges, relations, people, on]);

  return (
    <div className="relation-graph">
      <div className="graph-toolbar">
        {kinds.map((k) => (
          <button
            key={k}
            className={on[k] ? "on" : ""}
            aria-pressed={on[k]}
            onClick={() => setOn((s) => ({ ...s, [k]: !s[k] }))}
          >
            <i style={{ background: kindColor[k] }} />
            {kindName[k]}
          </button>
        ))}
        {onFullscreen && (
          <button className="graph-fs" onClick={onFullscreen}>
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
              <path
                d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
            全屏
          </button>
        )}
      </div>

      <div className="rf-stage">
        <ReactFlow
          nodes={nodes}
          edges={nodeEdges.concat(satEdges)}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.18 }}
          minZoom={0.35}
          maxZoom={2}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnScroll={false}
          zoomOnScroll
          zoomOnPinch
          onNodeClick={(_, node) => {
            if (onFocus && node.id !== person.id) onFocus(node.id.replace(/^sat-[^-]+-/, ""));
          }}
          colorMode="light"
        >
          <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="#b9c0ab" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      <div className="relation-legend">
        <span>
          <i style={{ background: "#b8bda9" }} />
          二跳关系（较弱）
        </span>
        <em>点击节点切换人物 · 拖动画布 · 滚轮缩放</em>
      </div>
    </div>
  );
}
