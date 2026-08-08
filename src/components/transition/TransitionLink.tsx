"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useSiteTransition } from "./TransitionProvider";
import { tagForPath } from "@/lib/transitionTags";

type Props = Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & {
  href: string;
  /** Overrides the tag the destination would otherwise carry. */
  tag?: string;
};

/**
 * A Link that hands its navigation to the wipe. `onNavigate` (rather than
 * onClick) means cmd-click, middle-click and external hrefs still behave like
 * ordinary links — Next only fires it for real same-origin SPA navigations.
 */
export function TransitionLink({ href, tag, children, ...rest }: Props) {
  const { begin } = useSiteTransition();

  return (
    <Link
      href={href}
      onNavigate={(event) => {
        if (begin(href, tag ?? tagForPath(href))) event.preventDefault();
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
