import sys, json, math, random
D, out = sys.argv[1], sys.argv[2]
def read(path):
    L = open(path).read().splitlines()
    na, nb = int(L[3][:3]), int(L[3][3:6])
    atoms = []
    for l in L[4:4+na]:
        x, y, z = float(l[0:10]), float(l[10:20]), float(l[20:30]); el = l[31:34].strip()
        atoms.append([el, x, y, z])
    bonds = [(int(l[0:3])-1, int(l[3:6])-1) for l in L[4+na:4+na+nb]]
    return atoms, bonds
res = {}
for slug, f in [('creatine','creatine.3d.sdf'),('turmeric-complex','curcumin.3d.sdf'),('ashwagandha','withaferin_a.3d.sdf'),('lions-mane','erinacine_a.3d.sdf')]:
    res[slug] = read(f"{D}/{f}")[0]
# CoQ10: 2D layout given gentle depth (PubChem has no 3D conformer: too flexible)
a, _ = read(f"{D}/coq10.2d.sdf"); random.seed(10)
res['coq10'] = [[e, x, y, 0.9*math.sin(x*0.45) + random.uniform(-0.25, 0.25)] for e, x, y, z in a]
# Magnesium bisglycinate: two glycinates chelating Mg through N and a carboxylate O
g, b = read(f"{D}/glycine.3d.sdf")
N = [i for i, t in enumerate(g) if t[0] == 'N'][0]
Os = [i for i, t in enumerate(g) if t[0] == 'O']
v = lambda i: [g[i][1], g[i][2], g[i][3]]
dist = lambda p, q: math.dist(p, q)
O = min(Os, key=lambda i: dist(v(i), v(N)))
Oh = [i for i in Os if i != O][0]
# drop the acidic H (bonded to the other O) -> glycinate
acidH = [j for (i, j) in b if i == Oh and g[j][0] == 'H'] + [i for (i, j) in b if j == Oh and g[i][0] == 'H']
gl = [t for k, t in enumerate(g) if k not in acidH]
idx = {k: n for n, k in enumerate([k for k in range(len(g)) if k not in acidH])}
pn, po = v(N), v(O)
mid = [(pn[i]+po[i])/2 for i in range(3)]
cen = [sum(t[i+1] for t in gl)/len(gl) for i in range(3)]
away = [mid[i]-cen[i] for i in range(3)]; L = math.sqrt(sum(c*c for c in away)); away = [c/L for c in away]
half = dist(pn, po)/2; h = math.sqrt(max(0.1, 2.1**2 - half**2))
mg = [mid[i] + away[i]*h for i in range(3)]
mol = [[t[0], t[1]-mg[0], t[2]-mg[1], t[3]-mg[2]] for t in gl]
# second ligand: point reflection through Mg (trans arrangement)
mol2 = [[t[0], -t[1], -t[2], -t[3]] for t in mol]
res['magnesium-complex'] = mol + mol2 + [['Mg', 0.0, 0.0, 0.0]]
json.dump({k: [[e, round(x, 3), round(y, 3), round(z, 3)] for e, x, y, z in v_] for k, v_ in res.items()}, open(out, 'w'))
print({k: len(v_) for k, v_ in res.items()})
