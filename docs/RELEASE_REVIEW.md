# Distribution review record

Review date: 19 September 2026. Status: **public release condition not satisfied**.
This is a source/provenance review and a record of unresolved questions, not a
legal opinion or a guarantee against a claim. No public repository has been
created or pushed by this work.

The latest request is to continue through GitHub deployment. A private
development repository has been created at
[hyoseokp/photonweave](https://github.com/hyoseokp/photonweave). This is an
intermediate development delivery while the earlier public-release conditions
remain open. Its [preview scope](PREVIEW_RELEASE.md) identifies implemented
features and remaining gaps. No public visibility change is authorized by this
review record, and private staging is not legal clearance.

User clarification: the applicable licence is unknown. The earlier instruction
excluded Lumerical calculation results. The latest instruction makes a limited
exception for an aggregate speed-comparison table in the local README, with
Lumerical as the primary comparison target. Historical field results, plots,
projects and logs remain excluded. The manuscript and numerical validation
continue to use analytic solutions and native CPU/GPU results. This exception
does not establish public-release permission. It does not erase the provenance
of legacy compatibility-derived automatic pulse rules or FSP work, which still
need review or an independent replacement before a cleared public release.

## User's condition

The requested public GitHub release is conditional on completion and a judgment
that Ansys/Lumerical has no actionable copyright grounds. The intended account
was confirmed read-only as `hyoseokp`. Both the feature-completeness requirement
and the legal condition remain open. Authentication does not authorize ignoring
those conditions.

## Timing-table exception and publication status

The local README now summarizes three existing paired timing records. It does
not rerun the commercial solver or redistribute field/spectrum arrays, figures,
screenshots, projects or engine logs. A private extraction audit retains the
source hashes, repetition counts and checked arithmetic. The table identifies
the earlier native builds, CPU configuration, timing scopes and lack of an
established same-accuracy comparison. Current-version CPU, same-GPU and batch
comparisons remain pending. No later native optimization ratio is combined
with an older commercial timing.

The user's table request supersedes the earlier no-results instruction only
for these aggregate timing facts and their necessary qualifications. It does
not turn the conditional public-release request into unconditional approval.

Facts and expressive material need separate copyright analysis. For example,
the [U.S. Copyright Office's FAQ](https://www.copyright.gov/help/faq/faq-general.html)
states that copyright does not protect facts, while it can protect their
expression. This is not a determination of the law governing this project or
of contractual rights under the installed licence.

The [public Ansys Academic Usage terms](https://www.ansys.com/legal/terms-and-conditions/academic-usage),
item 3, expressly restrict competitive analysis, including benchmarking.
The actual installed licence type and governing agreement are still unknown.
The existence of this restriction means that a timing-only table is not enough
to conclude public release is clear. It does not establish that this particular
academic agreement governs the user's installation. The previously identified
general licence issue below remains a separate consideration. No vendor has
been contacted and no public push is performed by this edit.

## Confirmed implementation facts

- The native solver uses an MIT-licensed open-source grid/backend dependency and
  independently written numerical operators and workbench code.
- The frontend uses Three.js and Lucide with their notices preserved. The README
  hero is original artwork generated from a native computed field. It contains no
  vendor logo, screenshot or icon assets.
- Native Python simulation does not need a commercial executable, licence manager
  or proprietary material library. Built-in material names identify constant-index
  approximations, not a redistribution of a vendor optical-constant database.
- The technical paper credits the upstream solver foundation and references
  TORCWA as related work. It does not incorporate TORCWA source code.
- The source archive allowlist excludes local credentials, SSH host records,
  raw `results/`, the retired comparison archive and virtual environments.
  Current `docs/validation/` result files use native calculations only. The
  installed property-name catalogue is separately identified as an unresolved
  provenance item, not a simulation result.

## Contract issue that prevents clearance

Ansys's publicly posted **9 April 2025 License Terms**, section 1(d), excludes
using its program, output or simulation results to create a competing or similar
product from its definition of permitted internal business purposes. Section 2(e)
also restricts reverse engineering and decoding, subject to its stated
interoperability/local-law provisions. This creates a concrete issue for earlier
comparisons and FSP work. The applicable customer agreement, order form, date,
licence type and mandatory jurisdictional rules have not been established.

Source: [Ansys License Terms, 9 April 2025](https://www.ansys.com/content/dam/legal/license-terms-april-2025.pdf).
The public terms are evidence of a possible contractual restriction, not proof
that this particular agreement governs the user's installed v241 licence.

No claim is made that reading a data format necessarily equals decoding the
licensed program, or that an interoperability exception automatically applies.
That determination requires the actual governing agreement and applicable law.
No further vendor-based experiments are necessary for the new native slab and
batch validations, which use independently constructed Python models.

## Material requiring a specific distribution decision

| Material | Current status | Required decision |
| --- | --- | --- |
| Native numerical engine and original UI | Implemented and partially validated | Final provenance/dependency review and completion criteria |
| Native slab/batch results and hero artwork | Generated without vendor output | Retain reproduction inputs and measured scope |
| `fsp_binary.py`, `fsp_native.py`, format documentation | Independently inferred observed-layout support | Review contract, interoperability rights and distribution scope |
| Optional installed-API bridge | Requires licensed vendor installation | Review applicable API and contractual permissions |
| Installed property catalogue | Public API names were queried, not copied vendor code | Review permitted use of catalogue extraction in this context |
| Earlier commercial benchmark reports | Raw records retired to an excluded local archive. Aggregate timing exception in local README | Latest instruction permits the timing table. General result redistribution and public-release clearance remain excluded/pending |
| Legacy automatic pulse rules | Inferred in earlier compatibility work | Review provenance or replace with an independently specified native policy |
| Vendor software/material databases/raw projects | Not part of the source allowlist | Do not bundle proprietary runtime/database assets |

Removing an interoperability module would not automatically settle the provenance
or contract questions about work already performed. A narrower native-only public
package is a possible release scope, but has not been substituted for the user's
requested complete release without their direction.

## Outstanding release gates

1. Resolve interoperability and legacy compatibility-code provenance under the
   actual agreement or replace the affected features independently. Earlier vendor
   field/spectrum results remain excluded. The README timing exception does not
   resolve this gate. No third party has been contacted.
2. Complete or explicitly agree a narrower product scope. The feature checklist
   currently contains many partial and unimplemented functions.
3. Regenerate source/package licence records and inspect the exact release file
   list for proprietary data, credentials, private paths and obsolete claims.
4. Validate the chosen release on the RTX 5880, run the UI/Python suites and verify
   that documentation, version strings and packaged assets describe the same code.
5. Review the manuscript's scientific claims and authorship statement before any
   public paper submission. No submission has occurred.

Public publication remains deferred on these explicit task conditions. Native
implementation, analytic validation and local documentation can continue.
