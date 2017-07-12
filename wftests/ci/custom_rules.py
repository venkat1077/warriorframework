"""
Use ast module to check custom rules enforced by warrior dev team
"""
import ast
import sys
import pprint

def func_check(node, kw=False):
    '''
    Function specific check
        Action - check return type
        Action - check pstep/psubstep buddy with report_step/report_substep_status
        check docstring
        check print statement - should use print_utils
        scan for class - class check
        scan for function - recursive function check
    '''
    status = True
    have_return = False
    substep_count = 0

    for child in ast.walk(node):
        if child != node and isinstance(child, ast.FunctionDef):
            if kw and child.name.startswith("_"):
                print node.name, child.name, "should move to utils"
                status = False
            tmp_status = func_check(child, kw)
            status &= tmp_status
        elif child != node and isinstance(child, ast.ClassDef):
            tmp_status = class_check(child, kw)
            status &= tmp_status
        elif isinstance(child, ast.Print):
            status = False
            print "Please use print_Utils instead of print in {}: {}".format(sys.argv[1], child.lineno)
        elif isinstance(child, ast.Return):
            have_return = True
        elif isinstance(child, ast.Attribute) and child.attr == 'pSubStep':
            substep_count += 1
        elif isinstance(child, ast.Attribute) and child.attr == 'report_substep_status':
            substep_count -= 1

    if ast.get_docstring(node) is None:
        print node.name, "doesn't contain any docstring"
        status = False
    if kw and not have_return and node.name != "__init__":
        print node.name, "doesn't contain a return statement"
        status = False
    if kw and substep_count:
        print node.name, "have non-pair pSubStepreport_substep_status"
        status = False
    return status

def class_check(node, kw=False):
    '''
    Class specific check
        Action - check private method, move to utils
        check docstring
        scan for class - recursive class check
        scan for function - function check
    '''
    status = True

    for child in ast.iter_child_nodes(node):
        if isinstance(child, ast.FunctionDef):
            if kw and child.name.startswith("_") and child.name != "__init__":
                print node.name, child.name, "should move to utils"
                status = False
            tmp_status = func_check(child, kw)
            status &= tmp_status
        elif isinstance(child, ast.ClassDef):
            tmp_status = class_check(child, kw)
            status &= tmp_status

    if ast.get_docstring(node) is None:
        print node.name, "doesn't contain any docstring"
        status = False
    return status

def main(kw=False):
    """
    main method to build ast tree and call subseq functions
    Top level check
        license info
        scan for class - class check
        scan for function - function check
    """
    f = open(sys.argv[1])
    if "-kw" in sys.argv:
        kw = True
    root = ast.parse(f.read())
    have_license = False
    status = True
    for child in ast.iter_child_nodes(root):
        if isinstance(child, ast.FunctionDef):
            status &= func_check(child, kw)
        elif isinstance(child, ast.ClassDef):
            status &= class_check(child, kw)
        elif isinstance(child, ast.Expr):
            license_text = \
'''
Copyright 2017, Fujitsu Network Communications, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
'''
            if child.value.s == license_text:
                have_license = True

    if not have_license:
        print "file doesn't have license text"

    status &= have_license
    return status

if __name__ == "__main__":
    if main():
        print "PASS"
        exit(0)
    else:
        print "FAIL"
        exit(1)