import type { TeamContribution } from '../../models/strategy'
import { w1 } from './w1-context'
import { w2 } from './w2-refining-context'
import { w3 } from './w3-refining-solutions'
import { w4 } from './w4-distribution-context'
import { w5 } from './w5-distribution-solutions'
import { w6 } from './w6-economics'
import { w7 } from './w7-integrated-strategy'
import { w8 } from './w8-executive'

export const workstreams: readonly TeamContribution[] = [w1, w2, w3, w4, w5, w6, w7, w8]
