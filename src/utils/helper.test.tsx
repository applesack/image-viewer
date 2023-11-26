import { describe, expect, test } from "vitest";
import { createSlot, minmax } from "./helper.ts";
import { mount } from "@vue/test-utils";

describe("helper.ts", () => {
  test("minmax", () => {
    expect(minmax(90, 0, 100)).eq(90);
    expect(minmax(101, 0, 100)).eq(100);
    expect(minmax(-15, 0, 100)).eq(0);
    expect(minmax(0, 0, 100)).eq(0);
    expect(minmax(-0, 0, 100)).eq(0);
    expect(minmax(100, 0, 100)).eq(100);
  });

  test("createSlot", () => {
    let slotWid = "";
    let slotHei = "";
    const handleFn = (dom: HTMLElement) => {
      slotWid = dom.style.width;
      slotHei = dom.style.height;
    };
    const Slot = createSlot(handleFn);
    const TestDOM = <div style={{ width: "100px", height: "200px" }}></div>;
    mount(() => <Slot node={TestDOM}></Slot>);
    expect(slotWid).eq("100px");
    expect(slotHei).eq("200px");
  });
});
