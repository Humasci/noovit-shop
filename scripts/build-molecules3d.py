# 3D ball-and-stick data for the at-home test figures (21 Nov): PubChem's own 3D conformers (record_type=3d), hydrogens
# kept, only centred and rotated to the molecule's principal axes (never edited). Output: data/molecules3d.json.
# Download: https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/<CID>/record/SDF?record_type=3d -> <name>.3d.sdf
# Run: python3 scripts/build-molecules3d.py <sdf-dir> data/molecules3d.json
import sys, json
D, out = sys.argv[1], sys.argv[2]
CIDS = {'cortisol': 5754, 'testosterone': 6013, 'cholesterol': 5997, 'calcifediol': 5283731, 'thyroxine': 5819, 'estradiol': 5757}
def read(path):
    L = open(path).read().splitlines()
    na, nb = int(L[3][:3]), int(L[3][3:6])
    atoms = [[l[31:34].strip(), float(l[0:10]), float(l[10:20]), float(l[20:30])] for l in L[4:4+na]]
    bonds = [[int(l[0:3])-1, int(l[3:6])-1, int(l[6:9])] for l in L[4+na:4+na+nb]]
    return atoms, bonds
def principal(atoms):
    # Rotate to principal axes (power iteration on the 3x3 covariance); a pure rotation, distances unchanged.
    n = len(atoms); c = [sum(a[i] for a in atoms)/n for i in (1, 2, 3)]
    P = [[a[1]-c[0], a[2]-c[1], a[3]-c[2]] for a in atoms]
    C = [[sum(p[i]*p[j] for p in P) for j in range(3)] for i in range(3)]
    def mv(M, v): return [sum(M[i][j]*v[j] for j in range(3)) for i in range(3)]
    def nrm(v): s = sum(x*x for x in v) ** 0.5; return [x/s for x in v]
    axes = []
    for k in range(3):
        v = nrm([1.0, 0.7, 0.3][k:] + [1.0, 0.7, 0.3][:k])
        for _ in range(200):
            v = mv(C, v)
            for a in axes: d = sum(x*y for x, y in zip(v, a)); v = [x - d*y for x, y in zip(v, a)]
            v = nrm(v)
        axes.append(v)
    # keep a right-handed frame so the molecule is never mirrored
    a, b = axes[0], axes[1]
    axes[2] = [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]
    return [[atoms[i][0]] + [round(sum(P[i][j]*ax[j] for j in range(3)), 4) for ax in axes] for i in range(n)]
res = {}
for name, cid in CIDS.items():
    a, b = read(f"{D}/{name}.3d.sdf")
    res[name] = {'cid': cid, 'atoms': principal(a), 'bonds': b}
json.dump(res, open(out, 'w'))
print({k: len(v['atoms']) for k, v in res.items()})
